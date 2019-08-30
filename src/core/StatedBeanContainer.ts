import { Event } from '../event';
import {
  ClassType,
  StatedBeanMeta,
  StatedFieldMeta,
  BeanRegisterOption,
} from '../types';
import { isFunction } from '../utils';

import { EffectContext } from './EffectContext';
import { ForceUpdate } from './ForceUpdate';
import { NoSuchBeanDefinitionError } from './NoSuchBeanDefinitionError';
import { StatedBeanApplication } from './StatedBeanApplication';
import { StatedBeanRegistry } from './StatedBeanRegistry';

export class StatedBeanContainer extends Event {
  private readonly _parent?: StatedBeanContainer;

  private readonly _app!: StatedBeanApplication;

  private readonly registry: StatedBeanRegistry = new StatedBeanRegistry();

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
  }

  getBean<T>(type: ClassType<T>, name?: string): T | undefined {
    let bean = this.registry.getBean(type, name);

    if (bean == null && this.parent) {
      bean = this.parent.getBean(type, name);
    }

    return bean as T;
  }

  hasBean<T>(type: ClassType<T>, name?: string): boolean {
    return this.getBean(type, name) !== undefined;
  }

  register<T>(type: ClassType<T>, options?: BeanRegisterOption) {
    const beanFactory = this.application.getBeanFactory();
    const bean = beanFactory.get(type);

    if (bean === undefined) {
      throw new Error(
        `The bean is undefined get from the BeanFactory[${beanFactory.constructor.name}]`,
      );
    }
    return this.registerBean(type, bean, options);
  }

  async registerBean<T>(
    type: ClassType<T>,
    beanOrSupplier: T | (() => T),
    options: BeanRegisterOption = {},
  ): Promise<void> {
    if (this.registry.getBean(type, options.name) !== undefined) {
      return;
    }

    let bean: T;
    if (isFunction(beanOrSupplier)) {
      const supplier = beanOrSupplier as () => T;
      bean = supplier();
    } else {
      bean = beanOrSupplier as T;
    }

    if (!(bean instanceof type)) {
      throw new Error(`bean ${bean} mast be an instance of ${type.name}`);
    }

    const beanMeta = this.registry.getBeanMeta(type);

    if (beanMeta === undefined) {
      throw new NoSuchBeanDefinitionError(type.name);
    }

    this.registry.register(type, bean, options.name);

    this._defineForceUpdate(bean, beanMeta);

    const fields = beanMeta.statedFields || [];
    const observers = (fields || []).map(field =>
      this._observeBeanField(bean, field, beanMeta),
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

  // @internal
  private _defineForceUpdate<T>(bean: T, beanMeta: StatedBeanMeta) {
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
        const effect = self._createEffectContext(
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

  // @internal
  private async _observeBeanField(
    bean: any,
    fieldMeta: StatedFieldMeta,
    beanMeta: StatedBeanMeta,
  ) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v');

    const initEffect = this._createEffectContext(
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
        const effect = self._createEffectContext(
          bean[proxyField],
          bean,
          beanMeta,
          fieldMeta,
          value,
        );

        bean[proxyField] = value;
        self.emit(bean, effect);
        self.application.interceptStateChange(effect).then(() => {
          if (effect.getValue() !== value) {
            bean[proxyField] = effect.getValue();
            self.emit(bean, effect);
          }
        });
      },
      get() {
        return bean[proxyField];
      },
    });
  }

  // @internal
  private _createEffectContext<Bean, Value>(
    oldValue: Value,
    bean: Bean,
    beanMeta: StatedBeanMeta,
    fieldMeta: StatedFieldMeta,
    value?: Value,
  ): EffectContext {
    return new EffectContext(oldValue, bean, beanMeta, fieldMeta, this, value);
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
