import { getMetadataStorage } from '../metadata';
import {
  BeanProvider,
  StatedBeanMeta,
  ClassType,
  StatedFieldMeta,
} from '../types';
import { isFunction, getPropertiesWithoutFunction } from '../utils';

export const UN_NAMED_BEAN = Symbol('UN_NAMED_BEAN');

export class BeanDefinition<T> {
  private _target: T | undefined;

  constructor(private readonly _beanProvider: BeanProvider<T>) {}

  getFactory() {
    return this._beanProvider.factory;
  }

  getFactoryBeanType() {
    return this.target !== undefined
      ? (((this.target as unknown) as object).constructor as ClassType<T>)
      : this.beanType;
  }

  setTarget(bean: T) {
    this._target = bean;

    // plain object method binding
    if (this.isPlainObject) {
      Object.keys(bean).forEach((key: keyof T & string) => {
        if (typeof bean[key] === 'function') {
          Object.defineProperty(bean, key, {
            value: ((bean[key] as unknown) as Function).bind(bean),
          });
        }
      });
    }
  }

  protected get target() {
    return this._target;
  }

  get beanType() {
    return this._beanProvider.type;
  }

  get isSingleton(): boolean {
    return !!(
      this._beanProvider.singleton ||
      (this.beanMeta ? this.beanMeta.singleton : false)
    );
  }

  get beanName(): string | symbol {
    const beanName = this._beanProvider.name || this.beanMeta.name;
    if (this.isSingleton) {
      return beanName || this.beanType.name;
    } else {
      return beanName || UN_NAMED_BEAN;
    }
  }

  get beanMeta(): StatedBeanMeta {
    const storage = getMetadataStorage();
    const beanType = this.isFactoryBean
      ? this.getFactoryBeanType()
      : this.beanType;
    const beanMeta = storage.getBeanMeta(beanType);

    if (beanMeta === undefined) {
      return {
        target: beanType,
        name: this._beanProvider.name,
        statedFields: (getPropertiesWithoutFunction(this.target) || []).map(
          property => {
            return {
              name: property,
              target: beanType,
            } as StatedFieldMeta;
          },
        ),
      };
    }
    return beanMeta;
  }

  get isNamedBean() {
    return this.beanName !== UN_NAMED_BEAN;
  }

  get isFactoryBean() {
    return isFunction(this._beanProvider.factory);
  }

  get isPlainObject() {
    if (this.isFactoryBean) {
      return this.getFactoryBeanType().name === 'Object';
    } else {
      return this.beanType.name === 'Object';
    }
  }

  get props() {
    return this._beanProvider.props;
  }
}
