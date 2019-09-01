import { StatedBeanSymbol } from '../core';

export const isFunction = (func: unknown) => typeof func === 'function';

export const isStatedBean = (obj: unknown) =>
  Object.hasOwnProperty.call(obj, StatedBeanSymbol);
