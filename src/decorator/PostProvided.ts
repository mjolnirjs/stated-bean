import { getMetadataStorage } from '../metadata';

/**
 * The `PostProvided` decorator is used on a method that needs to be executed after the StatedBean be instanced to perform any initialization.
 *
 * @export
 * @returns {MethodDecorator}
 */
export function PostProvided(): MethodDecorator {
  return (
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
}
