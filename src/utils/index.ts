import { StatedBeanSymbol } from '../core/Symbols';

export const isFunction = (func: unknown) => typeof func === 'function';

export const isStatedBean = (obj: unknown) =>
  Object.hasOwnProperty.call(obj, StatedBeanSymbol);

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as { then: unknown }).then === 'function';
}
