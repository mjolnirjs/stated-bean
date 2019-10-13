import { ClassType } from '../types';

import { BeanDefinition } from './BeanDefinition';
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

  getTypedObserver<T>(type: ClassType<T>): Array<BeanObserver<T>> | undefined {
    let beanObservers = this.getBeanRegistry().getTypedBean(type);

    if (beanObservers == null && this.parent) {
      beanObservers = this.parent.getTypedObserver(type);
    }

    return beanObservers;
  }

  getNamedObserver<T>(name: string | symbol): BeanObserver<T> | undefined {
    let beanObserver = this.getBeanRegistry().getNamedBean<T>(name);

    if (beanObserver == null && this.parent) {
      beanObserver = this.parent.getNamedObserver(name);
    }

    return beanObserver;
  }

  register<T>(beanDefinition: BeanDefinition<T>) {
    return this.getBeanRegistry().register(beanDefinition);
  }

  get parent() {
    return this._parent;
  }

  get application() {
    return this._app;
  }
}
