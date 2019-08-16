import { getMetadataStorage } from '../metadata';

export const PostProvided = (): MethodDecorator => (
  prototype,
  propertyKey,
  descriptor?: TypedPropertyDescriptor<any>,
) => {
  if (descriptor === undefined) {
    descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey)!;
  }
  getMetadataStorage().collectPostProvided({
    name: propertyKey,
    target: prototype.constructor,
    descriptor,
  });
  return descriptor;
};
