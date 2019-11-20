import { boundClass, StatedBeanClass } from '../core';
import { getMetadataStorage } from '../metadata';

export interface StatedBeanOptions {
  name?: string | symbol;
  singleton?: boolean;
}

/**
 * Indicates that an annotated class is a `StatedBean`.
 * The name may indicate a suggestion for the bean name. Its default value is `Class.name`.
 *
 * @export
 * @returns {ClassDecorator}
 */
export function StatedBean(
  options?: string | symbol | StatedBeanOptions
): ClassDecorator {
  return (target: Function) => {
    const name = typeof options === 'object' ? options.name : options;
    const singleton = typeof options === 'object' ? options.singleton : false;
    boundClass(target);
    Object.defineProperty(target, StatedBeanClass, {
      writable: false,
      value: true,
    });
    getMetadataStorage().collectStatedBean({
      name,
      target,
      singleton,
    });
  };
}
