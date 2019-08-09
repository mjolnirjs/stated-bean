import { getMetadataStorage } from '../metadata';

export function StatedBean(): ClassDecorator;
export function StatedBean(name?: string | Symbol): ClassDecorator {
  return (target: any) => {
    getMetadataStorage().collectStatedBean({
      name: name || target.name,
      target
    });
  };
}
