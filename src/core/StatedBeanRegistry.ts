import { BeanProvider, ClassType } from '../types';

import { BeanObserver } from './BeanObserver';
import { StatedBeanContainer } from './StatedBeanContainer';

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
    WeakMap<ClassType, BeanObserver<unknown>>
  >();

  constructor(private readonly _container: StatedBeanContainer) {}

  get beanFactory() {
    return this._container.application.getBeanFactory();
  }

  get<T>(
    type: ClassType<T>,
    identity?: string | symbol,
  ): BeanObserver<T> | undefined {
    const typedBeans = this._beans.get(identity || type.name);

    if (typedBeans === undefined) {
      return undefined;
    } else {
      return typedBeans.get(type) as BeanObserver<T>;
    }
  }

  register<T = unknown>(provider: BeanProvider<T>) {
    const bean = this.beanFactory.get(provider);
    const beanIdentity = provider.identity || provider.type.name;
    const strictProvider = {
      type: provider.type,
      bean,
      identity: beanIdentity,
    };

    const beanObserver = new BeanObserver<T>(this._container, strictProvider);
    beanObserver.state$.subscribeCount(count => {
      if (count === 0) {
        beanObserver.destroy();
        this.remove(strictProvider.type, strictProvider.identity);
      }
    });
    const typedBeans = this._beans.get(beanIdentity);

    if (typedBeans === undefined) {
      this._beans.set(
        beanIdentity,
        new WeakMap().set(provider.type, beanObserver),
      );
    } else {
      typedBeans.set(provider.type, (beanObserver as unknown) as BeanObserver<
        unknown
      >);
    }
  }

  remove<T>(type: ClassType<T>, identity?: string | symbol) {
    const typedBeans = this._beans.get(identity || type.name);
    if (typedBeans !== undefined) {
      typedBeans.delete(type);
    }
  }
}
