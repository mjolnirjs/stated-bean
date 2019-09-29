import { getMetadataStorage } from '../metadata';
import {
  BeanProvider,
  ClassType,
  StatedBeanMeta,
  StrictBeanProvider,
} from '../types';

import { StatedBeanApplication } from './StatedBeanApplication';
import { BeanObserver } from './BeanObserver';

/**
 * `StatedBeanContainer` is responsible for registering and managing `bean` and observing its `@Stated()` property changes.
 */
export class StatedBeanContainer {
  // @internal
  private readonly _parent?: StatedBeanContainer;

  // @internal
  private readonly _app!: StatedBeanApplication;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _beanObservers: WeakMap<any, BeanObserver<any>> = new WeakMap();

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
    this._beanObservers = new WeakMap();
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

    return bean as T;
  }

  getBeanObserver<T>(bean: T) {
    return this._beanObservers.get(bean);
  }

  register<T>(provider: BeanProvider<T>) {
    const beanFactory = this.getBeanFactory();
    if (provider !== undefined) {
      if (beanFactory.get(provider.type, provider.identity) === undefined) {
        beanFactory.register(provider);
      }
    }
  }

  registerAndObserve<T>(provider: BeanProvider<T>) {
    this.register(provider);
    const bean = this.getBean(provider.type, provider.identity);

    if (bean === undefined) {
      throw new Error('bean is undefined');
    }
    return this._observeBean({
      type: provider.type,
      bean,
      identity: this.getBeanIdentity(provider.type, provider.identity),
    });
  }

  hasBean<T>(type: ClassType<T>, name?: string | symbol): boolean {
    return this.getBean(type, name) !== undefined;
  }

  remove<T>(type: ClassType<T>, bean: T, name?: string | symbol) {
    if (this._beanObservers) {
      this._beanObservers.delete(bean);
    }
    this.getBeanFactory().remove(type, name);
  }

  protected _observeBean<T>(provider: StrictBeanProvider<T>): BeanObserver<T> {
    const bean = provider.bean;
    if (this._beanObservers.has(bean)) {
      return this._beanObservers.get(bean) as BeanObserver<T>;
    }

    const beanObserver = new BeanObserver<T>(this, provider);

    beanObserver.state$.subscribeCount(count => {
      if (count === 0) {
        beanObserver.destroy();
        if (this._beanObservers) {
          this._beanObservers.delete(bean);
        }
      }
    });
    this._beanObservers.set(bean, beanObserver);
    return beanObserver;
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
