import { getMetadataStorage } from '../metadata';

export function ObservableProps(name?: string): PropertyDecorator {
  return (prototype, propertyKey) => {
    getMetadataStorage().collectPropsField({
      name: propertyKey,
      prop: name || String(propertyKey),
      target: prototype.constructor,
      observable: true,
    });
  };
}
