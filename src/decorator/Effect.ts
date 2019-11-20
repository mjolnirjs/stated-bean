import { EffectAction } from '../types';
import { getBeanWrapper, isPromise } from '../utils';

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
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey)!;
    }
    const effectName = name || propertyKey;
    const originalMethod: Function = descriptor.value;
    descriptor.value = function<T>(this: T, ...args: unknown[]) {
      const beanWrapper = getBeanWrapper(this);
      if (beanWrapper !== undefined) {
        const emitEffectAction = (action: Partial<EffectAction<T>>) => {
          const observer = beanWrapper.beanObserver;

          if (observer !== undefined) {
            observer.effect$.next({
              effect: effectName,
              ...action,
            } as EffectAction<T>);
          }
        };
        emitEffectAction({ loading: true, error: null });

        const result = originalMethod.apply(this, args);

        if (isPromise(result)) {
          return result
            .then(data => {
              emitEffectAction({ data: data as T });
              return data;
            })
            .catch((e: unknown) => {
              emitEffectAction({ loading: false, error: e });
              throw e;
            })
            .finally(() => {
              emitEffectAction({ loading: false });
            });
        } else {
          emitEffectAction({ loading: false, data: result });
        }
        return result;
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
