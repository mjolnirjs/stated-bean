import { getStatedBeanContext } from '../context';
import { EffectContext } from '../core';
import { ClassType, StatedBeanType } from '../types';

import { useCallback, useContext, useEffect, useState } from 'react';

export interface UseStatedBeanOption<T> {
  name?: string | symbol;
  fields?: Array<keyof T>;
}

export function useInject<T>(
  type: ClassType<T>,
  option: UseStatedBeanOption<T> = {},
): StatedBeanType<T> {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback(
    (effect: EffectContext) => {
      const field = effect.fieldMeta.name as keyof T;
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

  const [bean] = useState(() => {
    if (container === undefined) {
      return undefined;
    }
    const bean = container.getBean<T>(type, option.name);
    if (bean !== undefined) {
      container.on(bean, beanChangeListener);
    }
    return bean;
  });

  if (bean === undefined) {
    throw new Error(`get bean[${type.name}] error`);
  }

  useEffect(() => {
    return () => {
      container.off(bean, beanChangeListener);
    };
  }, [container, bean, beanChangeListener]);

  return bean;
}
