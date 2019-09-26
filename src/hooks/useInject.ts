import { getStatedBeanContext } from '../context';
import { EffectEvent, EffectEventType } from '../core';
import { ClassType, StateChanged } from '../types';

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
 * @returns {StatedBeanType<T>}
 */
export function useInject<T>(
  type: ClassType<T>,
  option: UseStatedBeanOption<T> = {},
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback(
    (event: EffectEvent<T, StateChanged<unknown>>) => {
      if (event.type === EffectEventType.StateChanged) {
        const changedState = event.value;
        const field = changedState.fieldMeta.name as keyof T;
        if (
          option.fields == null ||
          option.fields.length === 0 ||
          option.fields.includes(field)
        ) {
          setVersion(prev => prev + 1);
        }
      }
    },
    [option.fields],
  );

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [bean] = useState(() => {
    if (container === undefined) {
      return undefined;
    }
    const bean = container.getBean<T>(type, option.name);
    if (bean !== undefined) {
      container.on({ type, bean, identity: option.name }, beanChangeListener);
    }
    return bean;
  });

  if (bean === undefined) {
    throw new Error(`get bean[${type.name}] error`);
  }

  useEffect(() => {
    return () => {
      container.off({ type, bean, identity: option.name }, beanChangeListener);
    };
  }, [container, bean, beanChangeListener, type, option.name]);

  return bean;
}
