import { ClassType } from '../types';

/**
 * BeanFactory interface
 *
 * @export
 * @interface IBeanFactory
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBeanFactory {
  get<T>(Type: ClassType<T>): T | undefined;
}

/**
 * the default `BeanFactory` by the class `new` constructor.
 */
export class DefaultBeanFactory implements IBeanFactory {
  get<T>(Type: ClassType<T>): T | undefined {
    return new Type();
  }
}
