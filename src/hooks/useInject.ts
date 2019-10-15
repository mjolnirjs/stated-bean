import { getStatedBeanContext } from '../context';
import { ClassType, StateAction } from '../types';

import { useCallback, useContext, useEffect, useState } from 'react';

export interface BeanInjectOption<T> {
  type?: ClassType<T>;
  name?: string | symbol;
  observedFields?: Array<keyof T>;
}

/**
 * injects the bean from the current context which has been provided.
 *
 * @export
 * @template T
 * @param {ClassType<T> | BeanInjectOption<T>} option
 * @returns {T}
 */
export function useInject<T>(option: ClassType<T> | BeanInjectOption<T>): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const type = typeof option === 'object' ? option.type : option;
  const { name, observedFields } =
    typeof option === 'object' ? option : ({} as BeanInjectOption<T>);

  const beanChangeListener = useCallback(
    (action: StateAction<T>) => {
      if (
        observedFields == null ||
        observedFields.length === 0 ||
        observedFields.includes(action.fieldMeta.name as keyof T)
      ) {
        setVersion(prev => prev + 1);
      }
    },
    [observedFields],
  );

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [observer] = useState(() => {
    let observer;
    if (name !== undefined) {
      observer = container.getNamedObserver<T>(name);
    } else if (type !== undefined) {
      const observers = container.getTypedObserver(type);
      if (observers !== undefined) {
        if (observers.length <= 1) {
          observer = observers[0];
        } else {
          throw new Error(`Multiple bean [${type.name}] found.`);
        }
      }
    }

    return observer;
  });

  if (observer === undefined) {
    throw new Error(`bean observer is undefined.`);
  }

  const [subscription] = useState(() => {
    return observer.state$.subscribe(beanChangeListener);
  });

  useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [subscription]);

  return observer.proxy;
}
