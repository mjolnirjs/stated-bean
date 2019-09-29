import { StatedBeanSymbol } from '../core';
import { EffectAction } from '../types';
import { isPromise, isStatedBean } from '../utils';

/**
 *
 * @export
 * @returns {MethodDecorator}
 */
export function Effect(name?: string | symbol): MethodDecorator {
  return (
    prototype,
    propertyKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey)!;
    }
    const effectName = name || propertyKey;
    const originalMethod: Function = descriptor.value;
    descriptor.value = function<T>(this: T, ...args: unknown[]) {
      if (isStatedBean(this)) {
        const container = this[StatedBeanSymbol].container;
        const observer = container.getObserverByBean(this);
        const emitEffectAction = (action: Partial<EffectAction>) => {
          if (observer !== undefined) {
            observer.effect$.next({
              loading: false,
              error: null,
              data: null,
              effect: effectName,
              ...action,
            });
          }
        };
        emitEffectAction({ loading: true });

        const result = originalMethod.apply(this, args);

        if (isPromise(result)) {
          result
            .then((data: unknown) => {
              emitEffectAction({ data });
              return data;
            })
            .catch((e: unknown) => {
              emitEffectAction({ error: e });
              return e;
            });
        } else {
          emitEffectAction({ data: result });
        }
        return result;
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
