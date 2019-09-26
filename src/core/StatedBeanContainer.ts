import { Event, EventListenFn } from '../event';
import { getMetadataStorage } from '../metadata';
import {
  BeanProvider,
  ClassType,
  StateChanged,
  StatedBeanMeta,
  StatedFieldMeta,
} from '../types';
import { isStatedBean } from '../utils';

import { EffectEvent, EffectEventType } from './EffectEvent';
import { NoSuchBeanDefinitionError } from './NoSuchBeanDefinitionError';
import { StatedBeanApplication } from './StatedBeanApplication';
import { StatedBeanSymbol } from './Symbols';

/**
 * `StatedBeanContainer` is responsible for registering and managing `bean` and observing its `@Stated()` property changes.
 */
export class StatedBeanContainer {
  // @internal
  private readonly _parent?: StatedBeanContainer;

  // @internal
  private readonly _app!: StatedBeanApplication;

  private readonly _event = new Event();

  constructor(parent?: StatedBeanContainer, app?: StatedBeanApplication) {
    if (parent == null && app == null) {
      this._app = new StatedBeanApplication();
    } else if (app != null) {
      this._app = app;
    } else if (parent != null) {
      this._parent = parent;
      this._app = parent.application;
    }
  }

  destroy() {
    // container destroy
  }

  getBeanFactory() {
    return this._app.getBeanFactory();
  }

  getBeanIdentity<T>(type: ClassType<T>, name?: string | symbol) {
    return name || this.getBeanMetaName(type) || type.name;
  }

  getBeanMetaName<T>(type: ClassType<T>): string | symbol | undefined {
    const beanMeta = this.getBeanMeta(type);

    return beanMeta === undefined ? undefined : beanMeta.name;
  }

  getBeanMeta<T>(type: ClassType<T>): StatedBeanMeta | undefined {
    const storage = getMetadataStorage();
    return storage.getBeanMeta(type);
  }

  getBean<T>(type: ClassType<T>, name?: string | symbol): T | undefined {
    const identity = this.getBeanIdentity(type, name);
    let bean = this.getBeanFactory().get(type, identity);

    if (bean == null && this.parent) {
      bean = this.parent.getBean(type, name);
    }

    if (bean !== undefined && !isStatedBean(bean)) {
      this.enhanceBean(type, bean, identity);
    }

    return bean as T;
  }

  // addBean<T>(bean: T) {
  //   if (isStatedBean(bean)) {
  //     const { identity, container } = bean[StatedBeanSymbol];
  //     // TODO: if need off the listener.
  //     container.on(bean, e => this.emit(bean, e));
  //     this.getBeanFactory().register({
  //       type: bean.constructor,
  //       bean,
  //       identity,
  //     });
  //   }
  // }

  hasBean<T>(type: ClassType<T>, name?: string): boolean {
    return this.getBean(type, name) !== undefined;
  }

  register<T>(provider: BeanProvider<T>) {
    const beanFactory = this.getBeanFactory();
    if (provider !== undefined) {
      if (beanFactory.get(provider.type, provider.identity) === undefined) {
        beanFactory.register(provider);
      }
    }
  }

  async enhanceBean<T>(type: ClassType<T>, bean: T, identity: string | symbol) {
    const beanMeta = this.getBeanMeta(type);

    if (beanMeta === undefined) {
      throw new NoSuchBeanDefinitionError(type.name);
    }
    this._defineStatedBean(bean, identity, beanMeta);

    const fields = beanMeta.statedFields || [];
    const observers = fields.map(field =>
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

  // forceUpdate<T>(bean: T, field: keyof T & string) {
  //   if (bean[field] === undefined) {
  //     return;
  //   }
  //   const fieldMeta = (beanMeta.statedFields || []).find(f => f.name === field);
  //   if (fieldMeta === undefined) {
  //     return;
  //   }
  //   const effect = new EffectEvent<T, StateChanged<unknown>>(
  //     bean,
  //     EffectEventType.StateChanged,
  //     field,
  //     {
  //       newValue: bean[field],
  //       oldValue: bean[field],
  //       fieldMeta,
  //       beanMeta,
  //     },
  //   );

  //   self.emit(bean, effect);
  // }

  on<T>(provider: BeanProvider<T>, cb: EventListenFn) {
    this._event.on(provider.bean, cb);
  }

  off<T>(provider: BeanProvider<T>, cb: EventListenFn) {
    this._event.off(provider.bean, cb);
    if (this._event.isEmpty(provider)) {
      this.getBeanFactory().remove(provider.type, provider.identity);
    }
  }

  emit<T>(bean: T, ...data: unknown[]) {
    this._event.emit(bean, ...data);
  }

  // @internal
  private _defineStatedBean<T>(
    bean: T,
    name: string | symbol,
    beanMeta: StatedBeanMeta,
  ) {
    const self = this;
    Object.defineProperty(bean, StatedBeanSymbol, {
      value: {
        name,
        container: this,
        forceUpdate: function(field: keyof T & string) {
          if (bean[field] === undefined) {
            return;
          }
          const fieldMeta = (beanMeta.statedFields || []).find(
            f => f.name === field,
          );
          if (fieldMeta === undefined) {
            return;
          }
          const effect = new EffectEvent<T, StateChanged<unknown>>(
            bean,
            EffectEventType.StateChanged,
            field,
            {
              newValue: bean[field],
              oldValue: bean[field],
              fieldMeta,
              beanMeta,
            },
          );

          self.emit(bean, effect);
        },
      },
    });
  }

  // @internal
  private _observeBeanField<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bean: T,
    fieldMeta: StatedFieldMeta,
    beanMeta: StatedBeanMeta,
  ) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v') as keyof T;

    Object.defineProperty(bean, proxyField, {
      writable: true,
      value: bean[fieldMeta.name as keyof T],
    });

    const self = this;
    Object.defineProperty(bean, fieldMeta.name.toString(), {
      set(value: T[keyof T]) {
        const effect = new EffectEvent<T, StateChanged<unknown>>(
          bean,
          EffectEventType.StateChanged,
          fieldMeta.name,
          {
            newValue: value,
            oldValue: bean[proxyField],
            fieldMeta,
            beanMeta,
          },
        );

        bean[proxyField] = value;
        self.emit(bean, effect);
        return self.application.invokeMiddleware(effect);
      },
      get() {
        return bean[proxyField];
      },
    });
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
