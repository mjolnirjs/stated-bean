import { EffectContext, StatedBeanScope, StatedBeanContainer } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

import { useContext, useState, useEffect, useCallback } from 'react';

export interface UseStatedBeanOption {
  dependentFields: Array<string | symbol>;
  scope: StatedBeanScope;
}

export function useStatedBean<T extends ClassType>(
  type: T,
  option: Partial<UseStatedBeanOption> = {
    dependentFields: [],
    scope: StatedBeanScope.DEFAULT,
  },
): InstanceType<T> {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback(
    (effect: EffectContext) => {
      // console.log('receive change event', effect);
      const field = effect.fieldMeta.name;
      if (
        option.dependentFields == null ||
        option.dependentFields.length === 0 ||
        option.dependentFields.includes(field)
      ) {
        setVersion(prev => prev + 1);
      }
    },
    [option.dependentFields],
  );

  const [container] = useState<StatedBeanContainer | undefined>(() => {
    let container;

    if (option.scope === StatedBeanScope.CONTEXT) {
      container = context.container;
    } else if (option.scope === StatedBeanScope.REQUEST) {
      container = new StatedBeanContainer();
      container.register(type);
    } else {
      container = context.container || new StatedBeanContainer();
      container.register(type);
    }

    if (container !== undefined) {
      container.on(type, beanChangeListener);
    }
    return container;
  });

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [bean] = useState(() => {
    return container.getBean<InstanceType<T>>(type);
  });

  if (bean === undefined) {
    throw new Error(`get bean[${type.name}] error`);
  }

  useEffect(() => {
    return () => container.off(type, beanChangeListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bean;
}
