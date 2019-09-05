import { StatedBeanType, EffectAction } from '../types';
import { StatedBeanSymbol, EffectEvent, EffectEventType } from '../core';
import { isPromise } from '../utils';

/**
 *
 * @export
 * @returns {MethodDecorator}
 */
export function Effect(name: string | symbol): MethodDecorator {
  return (
    prototype,
    propertyKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey)!;
    }
    const originalMethod = descriptor.value;
    descriptor.value = function(
      this: StatedBeanType<unknown>,
      ...args: unknown[]
    ) {
      const container = this[StatedBeanSymbol].container;

      const emitEffectAction = (action: EffectAction) => {
        container.emit(
          this,
          new EffectEvent<unknown, EffectAction>(
            this,
            EffectEventType.EffectAction,
            name,
            action,
          ),
        );
      };

      emitEffectAction({ loading: true, error: null });
      const result = originalMethod.apply(this, args);

      if (isPromise(result)) {
        result
          .then((data: unknown) => {
            emitEffectAction({ loading: false, error: null });
            return data;
          })
          .catch((e: unknown) => {
            emitEffectAction({ loading: false, error: e });
            return e;
          });
      } else {
        emitEffectAction({ loading: false, error: null });
      }
      return result;
    };
    return descriptor;
  };
}
