import { StatedBeanContainer } from './StatedBeanContainer';

export interface InitializingBean {
  afterProvided(): void;
}

export interface DisposableBean {
  destroy(): void;
}

export interface BeanContainerAware {
  setBeanContainer(beanContainer: StatedBeanContainer): void;
}

export function getProperty<T, K extends keyof T>(
  obj: T,
  key: string,
): T[K] | undefined {
  if (key in obj) {
    return obj[key as K];
  }
  return undefined;
}

export function isInitializingBean(bean: unknown): bean is InitializingBean {
  const property = getProperty(bean, 'afterProvided');
  return property !== undefined && typeof property === 'function';
}

export function isDisposableBean(bean: unknown): bean is DisposableBean {
  const property = getProperty(bean, 'destroy');
  return property !== undefined && typeof property === 'function';
}

export function isBeanContainerAware(
  bean: unknown,
): bean is BeanContainerAware {
  const property = getProperty(bean, 'setBeanContainer');
  return property !== undefined && typeof property === 'function';
}
