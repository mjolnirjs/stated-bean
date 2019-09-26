import { StatedBeanSymbol } from '../core/Symbols';
import { StatedBeanType } from '../types';

export const isFunction = (func: unknown) => typeof func === 'function';

export function isStatedBean<T>(obj: T): obj is StatedBeanType<T> {
  return Object.hasOwnProperty.call(obj, StatedBeanSymbol);
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as { then: unknown }).then === 'function';
}
