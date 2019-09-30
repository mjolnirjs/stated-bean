import { BeanProvider } from '../types';

/**
 * BeanFactory interface
 *
 * @export
 * @interface IBeanFactory
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBeanFactory {
  get<T>(provider: BeanProvider<T>): T;

  remove<T>(provider: BeanProvider<T>): void;
}

/**
 * the default `BeanFactory` by the class `new` constructor.
 */
export class DefaultBeanFactory implements IBeanFactory {
  get<T>(provider: BeanProvider<T>): T {
    if (provider.bean !== undefined) {
      return provider.bean;
    } else {
      // eslint-disable-next-line new-cap
      return new provider.type();
    }
  }

  remove() {
    //
  }
}
