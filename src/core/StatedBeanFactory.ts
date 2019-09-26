import { BeanProvider, ClassType } from '../types';

import { StatedBeanRegistry } from './StatedBeanRegistry';

/**
 * BeanFactory interface
 *
 * @export
 * @interface IBeanFactory
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBeanFactory {
  get<T>(type: ClassType<T>, identity?: string | symbol): T | undefined;

  register<T>(provider: BeanProvider<T>): void;

  remove<T>(type: ClassType<T>, identity?: string | symbol): void;
}

/**
 * the default `BeanFactory` by the class `new` constructor.
 */
export class DefaultBeanFactory implements IBeanFactory {
  // @internal
  private readonly _registry: StatedBeanRegistry = new StatedBeanRegistry();

  get<T>(type: ClassType<T>, identity?: string | symbol): T | undefined {
    return this._registry.get(type, identity);
  }

  register<T>(provider: BeanProvider<T>) {
    this._registry.register(provider);
  }

  remove<T>(type: ClassType<T>, identity?: string | symbol) {
    this._registry.remove(type, identity);
  }
}
