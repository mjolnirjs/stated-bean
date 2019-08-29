import { EffectContext, StatedBeanContainer, isStatedBean } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

import { useContext, useState, useEffect, useCallback } from 'react';

export interface UseStatedBeanOption {
  dependentFields: Array<string | symbol>;
}

export function useStatedBean<T>(
  type: ClassType<T> | (() => T),
  option: Partial<UseStatedBeanOption> = {},
): T {
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

  const [{ container, classType }] = useState<{
    container: StatedBeanContainer | undefined;
    classType: ClassType<T>;
  }>(() => {
    let classType: ClassType<T> = type as ClassType<T>;
    let container;
    if (!Object.hasOwnProperty.call(type, isStatedBean)) {
      const bean = (type as (() => T))();
      classType = (bean as any).constructor;
      container = new StatedBeanContainer();
      container.registerType(classType, bean);
    } else {
      container = context.container;
      if (container !== undefined) {
        container.register(classType);
      }
    }

    return { container, classType };
  });

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [bean] = useState(() => {
    const bean = container.getBean<T>(classType);
    if (container !== undefined) {
      container.on(bean, beanChangeListener);
    }
    return bean;
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
