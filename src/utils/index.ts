import { isStatedBean as StatedBeanSymbol } from '../core';

export const isFunction = (func: any) => typeof func === 'function';

export const isStatedBean = (obj: any) =>
  Object.hasOwnProperty.call(obj, StatedBeanSymbol);
