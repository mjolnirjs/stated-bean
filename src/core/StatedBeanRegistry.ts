import { ClassType } from '../types';
import { getBeanWrapper } from '../utils';

import { BeanDefinition } from './BeanDefinition';
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
  private readonly _typedBeans = new WeakMap<ClassType, [BeanObserver]>();

  private readonly _namedBeans = new Map<string | symbol, BeanObserver>();

  constructor(private readonly _container: StatedBeanContainer) {}

  get beanFactory() {
    return this._container.application.getBeanFactory();
  }

  getTypedBean<T>(type: ClassType<T>): Array<BeanObserver<T>> | undefined {
    return this._typedBeans.get(type) as Array<BeanObserver<T>>;
  }

  getNamedBean<T>(beanName: string | symbol): BeanObserver<T> | undefined {
    return this._namedBeans.get(beanName) as BeanObserver<T>;
  }

  register<T = unknown>(beanDefinition: BeanDefinition<T>): BeanObserver<T> {
    const namedBean = this.getNamedBean(beanDefinition.beanName);

    if (namedBean !== undefined) {
      return namedBean as BeanObserver<T>;
    }
    const beanObserver = this.createBeanObserver(beanDefinition);

    this._namedBeans.set(beanDefinition.beanName, beanObserver as BeanObserver);
    this._addTypedBean(beanDefinition.beanType, beanObserver as BeanObserver);
    return beanObserver;
  }

  createBeanObserver<T>(beanDefinition: BeanDefinition<T>) {
    const bean = this.beanFactory.createBean(beanDefinition);

    if (beanDefinition.isFactoryBean) {
      beanDefinition.extractFactoryBeanInfo(bean);
    }

    const beanObserver = new BeanObserver<T>(bean, this._container, beanDefinition);

    beanObserver.state$.subscribeCount(count => {
      if (count === 0) {
        this.remove(beanObserver);
        beanObserver.destroy();
      }
    });
    const beanWrapper = getBeanWrapper(bean);

    if (beanWrapper !== undefined) {
      beanWrapper.state$.subscribeCount(count => {
        if (count === 0) {
          this.beanFactory.destroyBean(beanDefinition, bean);
          beanWrapper.state$.complete();
        }
      });
    }
    return beanObserver;
  }

  remove<T>(beanObserver: BeanObserver<T>) {
    const beanDefinition = beanObserver.beanDefinition;

    this._namedBeans.delete(beanDefinition.beanName);
    const typedBeans = this._typedBeans.get(beanDefinition.beanType);

    if (typedBeans !== undefined) {
      const index = typedBeans.indexOf(beanObserver as BeanObserver);

      typedBeans.splice(index, 1);
    }
  }

  _addTypedBean(type: ClassType, beanObserver: BeanObserver) {
    const beans = this._typedBeans.get(type);

    if (beans === undefined) {
      this._typedBeans.set(type, [beanObserver]);
    } else {
      beans.unshift(beanObserver);
    }
  }
}
