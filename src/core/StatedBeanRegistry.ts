import { getMetadataStorage } from '../metadata';
import { ClassType, StatedBeanMeta } from '../types';

export class StatedBeanRegistry {
  // @internal
  private readonly beans = new Map<
    string | symbol,
    WeakMap<ClassType, unknown>
  >();

  getBean<T>(type: ClassType<T>, name?: string | symbol): T | undefined {
    const beanName = name || this.getBeanMetaName(type) || type.name;
    const typedBeans = this.beans.get(beanName);

    if (typedBeans === undefined) {
      return undefined;
    } else {
      return typedBeans.get(type) as T;
    }
  }

  register<T>(type: ClassType<T>, bean: T, name?: string | symbol) {
    const beanName = name || this.getBeanMetaName(type) || type.name;
    const typedBeans = this.beans.get(beanName);
    if (typedBeans === undefined) {
      this.beans.set(beanName, new WeakMap().set(type, bean));
    } else {
      typedBeans.set(type, bean);
    }
  }

  getBeanMetaName<T>(type: ClassType<T>): string | symbol | undefined {
    const beanMeta = this.getBeanMeta(type);

    return beanMeta === undefined ? undefined : beanMeta.name;
  }

  getBeanMeta<T>(type: ClassType<T>): StatedBeanMeta | undefined {
    const storage = getMetadataStorage();
    return storage.getBeanMeta(type);
  }
}
