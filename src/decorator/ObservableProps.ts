import { getMetadataStorage } from '../metadata';

export function ObservableProps(name?: string): PropertyDecorator {
  return (prototype, propertyKey) => {
    let prop = name;

    if (prop === undefined) {
      prop = String(propertyKey);

      if (prop.endsWith('$')) {
        prop = prop.substring(0, prop.length - 1);
      }
    }
    getMetadataStorage().collectPropsField({
      name: propertyKey,
      prop,
      target: prototype.constructor,
      observable: true,
    });
  };
}
