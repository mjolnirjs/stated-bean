import { ClassType } from '../types';

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

  getBean<T>(type: ClassType<T>, identity: string | symbol): T | undefined {
    const typedBeans = this._beans.get(identity);

    if (typedBeans === undefined) {
      return undefined;
    } else {
      return typedBeans.get(type) as T;
    }
  }

  register<T>(type: ClassType<T>, bean: T, identity: string | symbol) {
    const typedBeans = this._beans.get(identity);
    if (typedBeans === undefined) {
      this._beans.set(identity, new WeakMap().set(type, bean));
    } else {
      typedBeans.set(type, bean);
    }
  }
}
