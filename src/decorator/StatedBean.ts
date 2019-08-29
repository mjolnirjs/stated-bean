import { getMetadataStorage } from '../metadata';
import { isStatedBean } from '../core';

export function StatedBean(): ClassDecorator;
export function StatedBean(name?: string | symbol): ClassDecorator {
  return (target: any) => {
    Object.defineProperty(target, isStatedBean, {
      writable: false,
      value: true,
    });
    getMetadataStorage().collectStatedBean({
      name: name || target.name,
      target,
    });
  };
}
