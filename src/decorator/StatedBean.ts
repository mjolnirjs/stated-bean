import { getMetadataStorage } from '../metadata';
import { StatedBeanSymbol, boundClass } from '../core';

/**
 * Indicates that an annotated class is a `StatedBean`.
 * The name may indicate a suggestion for the bean name. Its default value is `Class.name`.
 *
 * @export
 * @returns {ClassDecorator}
 */
export function StatedBean(): ClassDecorator;
export function StatedBean(name?: string | symbol): ClassDecorator {
  return (target: Function) => {
    boundClass(target);
    Object.defineProperty(target, StatedBeanSymbol, {
      writable: false,
      value: true,
    });
    getMetadataStorage().collectStatedBean({
      name: name || target.name,
      target,
    });
  };
}
