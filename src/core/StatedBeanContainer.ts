import { ClassType, StatedFieldMeta, StatedBeanMeta } from '../types';
import { Event } from '../event';
import { getMetadataStorage } from '../metadata';

import { StatedBeanApplication } from './StatedBeanApplication';
import { EffectContext } from './EffectContext';
import { ForceUpdate } from './ForceUpdate';

export class StatedBeanContainer extends Event {
  private readonly _parent?: StatedBeanContainer;

  private readonly _app!: StatedBeanApplication;

  private readonly _types: ClassType[] = [];

  private readonly _beans = new WeakMap<ClassType, unknown>();

  constructor(parent?: StatedBeanContainer, app?: StatedBeanApplication) {
    super();

    if (parent == null && app == null) {
      this._app = new StatedBeanApplication();
    } else if (app != null) {
      this._app = app;
    } else if (parent != null) {
      this._parent = parent;
      this._app = parent.application;
    }

    // this._types.forEach(type => {
    //   const bean = this._app.getBeanFactory().get(type);
    //   this._beans.set(type, bean);
    // });
  }

  getBean<T>(type: ClassType<T>): T | undefined {
    let bean = this._beans.get(type);

    if (bean == null && this.parent) {
      bean = this.parent.getBean(type);
    }

    return bean as T;
  }

  hasBean<T>(type: ClassType<T>): boolean {
    return this.getBean(type) !== undefined;
  }

  register(...types: Array<ClassType<unknown>>) {
    if (types === undefined || types.length === 0) {
      return;
    }

    const registers = types.map(type => {
      if (!this._types.includes(type)) {
        const beanFactory = this.application.getBeanFactory();
        const bean = beanFactory.get(type);

        this._types.push(type);
        return this.registerBean(type, bean);
      } else {
        return Promise.resolve();
      }
    });

    return Promise.all(registers).then(() => {});
  }

  registerType<T>(type: ClassType<T>, bean?: T) {
    return this.registerBean(type, bean);
  }

  async registerBean<T>(type: ClassType<T>, bean: T | undefined) {
    this._beans.set(type, bean);
    const storage = getMetadataStorage();
    const beanMeta = storage.getBeanMeta(type);

    if (beanMeta === undefined || bean === undefined) {
      return;
    }

    this.addForceUpdate(bean, beanMeta);

    const fields = beanMeta.statedFields || [];
    const observers = (fields || []).map(field =>
      this.observeBeanField(bean, field, beanMeta),
    );
    await Promise.all(observers);

    if (
      beanMeta.postMethod != null &&
      beanMeta.postMethod.descriptor !== undefined
    ) {
      const f = beanMeta.postMethod.descriptor.value;
      f!.apply(bean);
    }
  }

  addForceUpdate<T>(bean: T, beanMeta: StatedBeanMeta) {
    const self = this;
    Object.defineProperty(bean, ForceUpdate, {
      value: function(field: keyof T & string) {
        if (bean[field] === undefined) {
          return;
        }
        const fieldMeta = (beanMeta.statedFields || []).find(
          f => f.name === field,
        );
        if (fieldMeta === undefined) {
          return;
        }
        const effect = self.createEffectContext(
          bean[field],
          bean,
          beanMeta,
          fieldMeta,
          bean[field],
        );

        self.emit(bean, effect);
      },
    });
  }

  async observeBeanField(
    bean: any,
    fieldMeta: StatedFieldMeta,
    beanMeta: StatedBeanMeta,
  ) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v');

    const initEffect = this.createEffectContext(
      bean[proxyField],
      bean,
      beanMeta,
      fieldMeta,
      bean[fieldMeta.name],
    );
    await this.application.interceptStateInit(initEffect);

    Object.defineProperty(bean, proxyField, {
      writable: true,
      value: initEffect.getValue(),
    });

    const self = this;
    Object.defineProperty(bean, fieldMeta.name.toString(), {
      set(value) {
        const effect = self.createEffectContext(
          bean[proxyField],
          bean,
          beanMeta,
          fieldMeta,
          value,
        );

        bean[proxyField] = value;
        self.application.interceptStateChange(effect).then(() => {
          if (effect.getValue() !== value) {
            bean[proxyField] = effect.getValue();
          }
          // console.log(bean.constructor.name + '_changed');
          self.emit(bean, effect);
        });
      },
      get() {
        return bean[proxyField];
      },
    });
  }

  createEffectContext<Bean, Value>(
    oldValue: Value,
    bean: Bean,
    beanMeta: StatedBeanMeta,
    fieldMeta: StatedFieldMeta,
    value?: Value,
  ): EffectContext {
    return new EffectContext(oldValue, bean, beanMeta, fieldMeta, this, value);
  }

  getAllBeanTypes() {
    return this._types;
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
