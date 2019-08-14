import { ClassType } from '../types/ClassType';
import { Event } from '../event';

import { StatedBeanApplication } from './StatedBeanApplication';

export class StatedBeanContainer extends Event {
  private readonly _parent?: StatedBeanContainer;

  private readonly _app: StatedBeanApplication;

  private readonly _types: ClassType[];

  private readonly _beans: WeakMap<ClassType<unknown>, unknown>;

  constructor(
    types: ClassType[],
    parent?: StatedBeanContainer,
    app?: StatedBeanApplication,
  ) {
    super();

    this._types = types;
    if (parent === undefined && app === undefined) {
      this._app = new StatedBeanApplication();
    } else if (app !== undefined) {
      this._app = app;
    } else if (parent !== undefined) {
      this._parent = parent;
      this._app = parent.application;
    } else {
      this._app = new StatedBeanApplication();
    }

    this._beans = new WeakMap();

    this._types.forEach(type => {
      const bean = this._app.getBeanFactory().get(type);

      this._beans.set(type, bean);
    });
  }

  getBean<T>(type: ClassType<T>): T | undefined {
    let bean = this._beans.get(type);

    if (bean === undefined && this.parent) {
      bean = this.parent.getBean<T>(type);
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
