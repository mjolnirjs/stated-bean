import { getMetadataStorage } from '../metadata';

export const PostProvided = (): MethodDecorator => (
  prototype,
  propertyKey,
  descriptor: TypedPropertyDescriptor<any>,
) => {
  getMetadataStorage().collectPostProvided({
    name: propertyKey,
    target: prototype.constructor,
    descriptor,
  });
  return descriptor;
};
