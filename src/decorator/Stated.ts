import { getMetadataStorage } from '../metadata';

export function Stated(): PropertyDecorator {
  return (prototype, propertyKey) => {
    getMetadataStorage().collectStatedField({
      name: propertyKey,
      target: prototype.constructor,
    });
  };
}
