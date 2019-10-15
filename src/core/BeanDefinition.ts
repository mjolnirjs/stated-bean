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
  private readonly _beanName: symbol;

  private readonly _beanMeta: StatedBeanMeta | undefined;
  private _factoryBeanType: ClassType<T> | undefined = undefined;
  private _factoryBeanMeta: StatedBeanMeta | undefined = undefined;

  constructor(private readonly _beanProvider: BeanProvider<T>) {
    this._beanName = Symbol(`${Date.now()}`);

    if (!this.isFactoryBean) {
      const beanMeta = getMetadataStorage().getBeanMeta(this.beanType);

      if (beanMeta === undefined) {
        throw new Error('bean metadata is undefined.');
      }
      this._beanMeta = beanMeta;
    }
  }

  extractFactoryBeanInfo(bean: T) {
    this._factoryBeanType = ((bean as unknown) as object)
      .constructor as ClassType<T>;

    if (this.isPlainObject) {
      Object.keys(bean).forEach((key: keyof T & string) => {
        if (typeof bean[key] === 'function') {
          Object.defineProperty(bean, key, {
            value: ((bean[key] as unknown) as Function).bind(bean),
          });
        }
      });
    }

    if (this.isPlainObject) {
      this._factoryBeanMeta = {
        target: this._factoryBeanType,
        name: this._beanProvider.name,
        statedFields: (getPropertiesWithoutFunction(bean) || []).map(
          property => {
            return {
              name: property,
              target: this._factoryBeanType,
            } as StatedFieldMeta;
          },
        ),
      } as StatedFieldMeta;
    }
  }

  getFactory() {
    return this._beanProvider.factory;
  }

  get factoryBeanType() {
    return this._factoryBeanType;
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
    const beanName =
      this._beanProvider.name ||
      (this.beanMeta ? this.beanMeta.name : undefined);
    if (this.isSingleton) {
      return beanName || this.beanType.name;
    } else {
      return beanName || this._beanName;
    }
  }

  get beanMeta(): StatedBeanMeta {
    if (this.isFactoryBean) {
      return this._factoryBeanMeta!;
    } else {
      return this._beanMeta!;
    }
  }

  get isNamedBean() {
    return this.beanName !== UN_NAMED_BEAN;
  }

  get isFactoryBean() {
    return isFunction(this._beanProvider.factory);
  }

  get isPlainObject() {
    if (this.isFactoryBean && this.factoryBeanType) {
      return this.factoryBeanType.name === 'Object';
    } else {
      return this.beanType.name === 'Object';
    }
  }

  get props() {
    return this._beanProvider.props;
  }
}
