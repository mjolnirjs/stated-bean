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
        const { container, type, identity } = this[StatedBeanSymbol];
        const emitEffectAction = (action: Partial<EffectAction>) => {
          const observer = container.getBeanObserver(type, identity);

          if (observer !== undefined) {
            observer.effect$.next({
              effect: effectName,
              ...action,
            } as EffectAction);
          }
        };
        emitEffectAction({ loading: true, data: null, error: null });

        const result = originalMethod.apply(this, args);

        if (isPromise(result)) {
          return result
            .then((data: unknown) => {
              emitEffectAction({ loading: false, data, error: null });
              return data;
            })
            .catch((e: unknown) => {
              emitEffectAction({ loading: false, data: null, error: e });
              throw e;
            });
        } else {
          emitEffectAction({ loading: false, data: result, error: null });
        }
        return result;
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
