import { getMetadataStorage } from '../metadata';
import { StatedBeanSymbol } from '../core';

export function StatedBean(): ClassDecorator;
export function StatedBean(name?: string | symbol): ClassDecorator {
  return (target: any) => {
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
