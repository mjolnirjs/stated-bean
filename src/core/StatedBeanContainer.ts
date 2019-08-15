import { ClassType } from '../types';
import { Event } from '../event';

import { StatedBeanApplication } from './StatedBeanApplication';

export class StatedBeanContainer extends Event {
  private readonly _parent?: StatedBeanContainer;

  private readonly _app!: StatedBeanApplication;

  private readonly _beans = new WeakMap<ClassType, unknown>();

  constructor(
    private readonly _types: ClassType[],
    parent?: StatedBeanContainer,
    app?: StatedBeanApplication,
  ) {
    super();

    if (parent == null && app == null) {
      this._app = new StatedBeanApplication();
    } else if (app != null) {
      this._app = app;
    } else if (parent != null) {
      this._parent = parent;
      this._app = parent.application;
    }

    this._types.forEach(type => {
      const bean = this._app.getBeanFactory().get(type);
      this._beans.set(type, bean);
    });
  }

  getBean<T>(type: ClassType<T>): T | undefined {
    let bean = this._beans.get(type);

    if (bean == null && this.parent) {
      bean = this.parent.getBean(type);
    }

    return bean as T;
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
