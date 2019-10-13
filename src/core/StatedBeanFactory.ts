import { BeanDefinition } from './BeanDefinition';

/**
 * BeanFactory interface
 *
 * @export
 * @interface IBeanFactory
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBeanFactory {
  createBean<T>(beanDefinition: BeanDefinition<T>): T;

  destroyBean<T>(beanDefinition: BeanDefinition<T>, bean: T): void;
}

/**
 * the default `BeanFactory` by the class `new` constructor.
 */
export class DefaultBeanFactory implements IBeanFactory {
  createBean<T>(beanDefinition: BeanDefinition<T>): T {
    if (beanDefinition.isFactoryBean) {
      const factory = beanDefinition.getFactory();
      return factory!(beanDefinition.props);
    } else {
      // eslint-disable-next-line new-cap
      return new beanDefinition.beanType(beanDefinition.props);
    }
  }

  destroyBean() {
    //
  }
}
