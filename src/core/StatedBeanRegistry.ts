import { BeanProvider, ClassType } from '../types';

/**
 * The named and types bean storage with `Map<string | symbol, WeakMap<ClassType, unknown>>`.
 *
 * @export
 * @class StatedBeanRegistry
 */
export class StatedBeanRegistry {
  // @internal
  private readonly _beans = new Map<
    string | symbol,
    WeakMap<ClassType, unknown>
  >();

  get<T>(type: ClassType<T>, identity?: string | symbol): T | undefined {
    const typedBeans = this._beans.get(identity || type.name);

    if (typedBeans === undefined) {
      return undefined;
    } else {
      return typedBeans.get(type) as T;
    }
  }

  register<T>(provider: BeanProvider<T>) {
    let obj;
    if (!('bean' in provider)) {
      // eslint-disable-next-line new-cap
      obj = new provider.type();
    } else {
      obj = provider.bean;
    }
    const beanIdentity = provider.identity || provider.type.name;
    const typedBeans = this._beans.get(beanIdentity);
    if (typedBeans === undefined) {
      this._beans.set(beanIdentity, new WeakMap().set(provider.type, obj));
    } else {
      typedBeans.set(provider.type, obj);
    }
  }

  remove<T>(type: ClassType<T>, identity?: string | symbol) {
    const typedBeans = this._beans.get(identity || type.name);
    if (typedBeans !== undefined) {
      typedBeans.delete(type);
    }
  }
}
