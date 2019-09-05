import { StatedBeanSymbol } from '../core/Symbols';

export const isFunction = (func: unknown) => typeof func === 'function';

export const isStatedBean = (obj: unknown) =>
  Object.hasOwnProperty.call(obj, StatedBeanSymbol);

export function isPromise(value: any): value is Promise<unknown> {
  return (
    !!value &&
    typeof value.subscribe !== 'function' &&
    typeof value.then === 'function'
  );
}
