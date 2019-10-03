import { getMetadataStorage } from '../metadata';
import { BeanProvider, ClassType, StatedBeanMeta } from '../types';

import { BeanObserver } from './BeanObserver';
import { StatedBeanApplication } from './StatedBeanApplication';
import { StatedBeanRegistry } from './StatedBeanRegistry';

/**
 * `StatedBeanContainer` is responsible for registering and managing `bean` and observing its `@Stated()` property changes.
 */
export class StatedBeanContainer {
  // @internal
  private readonly _parent?: StatedBeanContainer;

  // @internal
  private readonly _app!: StatedBeanApplication;

  private readonly _registry: StatedBeanRegistry;

  constructor(parent?: StatedBeanContainer, app?: StatedBeanApplication) {
    this._parent = parent;

    if (app != null) {
      this._app = app;
    } else if (this._parent != null && this._parent.application != null) {
      this._app = this._parent.application;
    } else {
      this._app = new StatedBeanApplication();
    }

    this._registry = new StatedBeanRegistry(this);
  }

  destroy() {
    // container destroy
  }

  getBeanRegistry() {
    return this._registry;
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
    const beanObserver = this.getBeanObserver(type, identity);

    if (beanObserver !== undefined) {
      return beanObserver.proxy;
    }
    return undefined;
  }

  getBeanObserver<T>(
    type: ClassType<T>,
    name?: string | symbol,
  ): BeanObserver<T> | undefined {
    const identity = this.getBeanIdentity(type, name);
    let beanObserver = this.getBeanRegistry().get(type, identity);

    if (beanObserver == null && this.parent) {
      beanObserver = this.parent.getBeanObserver(type, name);
    }

    return beanObserver;
  }

  register<T>(provider: BeanProvider<T>) {
    const beanRegistry = this.getBeanRegistry();

    return beanRegistry.register(provider);
  }

  registerAndObserve<T>(provider: BeanProvider<T>) {
    try {
      this.register(provider);

      const observer = this.getBeanObserver(
        provider.type,
        this.getBeanIdentity(provider.type, provider.identity),
      );

      if (observer === undefined) {
        throw new Error('observer is undefined');
      }
      return observer;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  hasBean<T>(type: ClassType<T>, name?: string | symbol): boolean {
    return this.getBean(type, name) !== undefined;
  }

  remove<T>(type: ClassType<T>, name?: string | symbol) {
    this.getBeanRegistry().remove(type, name);
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
