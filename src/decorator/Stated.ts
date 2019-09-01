import { getMetadataStorage } from '../metadata';

/**
 * Indicates that an annotated property is `Stated`.
 * Its reassignment will be observed and notified to the container.
 *
 * @export
 * @returns {PropertyDecorator}
 */
export function Stated(): PropertyDecorator {
  return (prototype, propertyKey) => {
    getMetadataStorage().collectStatedField({
      name: propertyKey,
      target: prototype.constructor,
    });
  };
}
