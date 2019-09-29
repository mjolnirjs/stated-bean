import { getStatedBeanContext } from '../context';
import { ClassType, StateAction } from '../types';

import { useCallback, useContext, useEffect, useState } from 'react';

export interface UseStatedBeanOption<T> {
  name?: string | symbol;
  fields?: Array<keyof T>;
}

/**
 * injects the bean from the current context which has been provided.
 *
 * @export
 * @template T
 * @param {ClassType<T>} type the `ClassType` of the bean.
 * @param {UseStatedBeanOption<T>} [option={}]
 * @returns {T}
 */
export function useInject<T>(
  type: ClassType<T>,
  option: UseStatedBeanOption<T> = {},
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback(
    (action: StateAction<T>) => {
      const field = action.fieldMeta.name as keyof T;
      if (
        option.fields == null ||
        option.fields.length === 0 ||
        option.fields.includes(field)
      ) {
        setVersion(prev => prev + 1);
      }
    },
    [option.fields],
  );

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [observer] = useState(() => {
    const bean = container.getBean(type, name);
    return container.getBeanObserver(bean);
  });

  if (observer === undefined) {
    throw new Error(`bean[${type}] observer is undefined`);
  }

  const [subscription] = useState(() => {
    return observer.state$.subscribe(beanChangeListener);
  });

  useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [subscription]);

  return observer.bean;
}
