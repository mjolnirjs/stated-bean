import { BeanWrapper } from '../core';
import { StatedBeanClass, StatedBeanWrapper } from '../core/Symbols';

export function isFunction(func: unknown): func is Function {
  return typeof func === 'function';
}

export function isStatedBeanClass(type: unknown) {
  return Object.hasOwnProperty.call(type, StatedBeanClass);
}

export function getBeanWrapper<T>(obj: T): BeanWrapper<T> | undefined {
  if (Object.hasOwnProperty.call(obj, StatedBeanWrapper)) {
    return Reflect.get((obj as unknown) as object, StatedBeanWrapper);
  }
  return undefined;
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as { then: unknown }).then === 'function';
}

export function getPropertiesWithoutFunction<T>(obj: T) {
  if (!obj) {
    return undefined;
  }
  return Object.keys(obj).filter((key: keyof T & string) => typeof obj[key] !== 'function');
}
