import { ClassType } from '../types/ClassType';
import { Event } from '../event'
import { IFactory, DefaultFactory } from './StatedBeanFactory';

export class StatedBeanContainer extends Event {
  private _parentContainer?: StatedBeanContainer;
  private _types: ClassType[];
  private _hooked: boolean = false;
  private _beans: WeakMap<ClassType<unknown>, unknown>;
  private _factory: IFactory;

  public constructor(types: ClassType[], beanFactory?: IFactory) {
    super();

    this._types = types;
    this._beans = new WeakMap();
    this._factory = beanFactory || new DefaultFactory();

    this._types.forEach(type => {
      const bean = this._factory.create(type);

      this._beans.set(type, bean);
    });
  }

  // private _proxy(bean: any) {
  //   const p = new Proxy(bean, {
  //     set: (obj, prop, value) => {
  //       console.log('proxy set');
  //       obj[prop] = value;
  //       this.emit(Symbol.for(obj.constructor.name + '_change'), obj, prop);
  //       return true;
  //     },
  //   });

  //   return p;
  // }

  public getBean<T>(type: ClassType<T>): T | undefined {
    let bean = this._beans.get(type);

    if (bean === undefined && this._parentContainer) {
      bean = this._parentContainer.getBean<T>(type);
    }

    return bean as T;
  }

  getAllBeanTypes() {
    return this._types;
  }

  setParent(parent?: StatedBeanContainer) {
    this._parentContainer = parent;
  }

  getParent() {
    return this._parentContainer;
  }

  setHooked(hooked: boolean) {
    this._hooked = hooked;
  }

  isHooked() {
    return this._hooked;
  }
}
