import { getMetadataStorage } from '../metadata';

export function PostProvided(): MethodDecorator {
  return (
    prototype: Record<string, any>,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    getMetadataStorage().collectPostProvided({
      name: propertyKey,
      target: prototype.constructor,
      descriptor,
    });
    return descriptor;
  };
}
