import { getMetadataStorage } from '../metadata';

export function StatedBean(): ClassDecorator;
export function StatedBean(name?: string | symbol): ClassDecorator {
  return (target: any) => {
    getMetadataStorage().collectStatedBean({
      name: name || target.name,
      target,
    });
  };
}
