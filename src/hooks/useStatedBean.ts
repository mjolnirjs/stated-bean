import { isFunction, isStatedBean } from '../utils';
import { getStatedBeanContext } from '../context';
import { EffectContext, StatedBeanContainer } from '../core';
import { ClassType } from '../types/ClassType';

import { useCallback, useContext, useEffect, useState } from 'react';

export interface UseStatedBeanOption {
  name: string | symbol;
  dependentFields: Array<string | symbol>;
}

export function useStatedBean<T>(
  typeOrSupplier: ClassType<T> | (() => T),
  option: Partial<UseStatedBeanOption> = {},
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback(
    (effect: EffectContext) => {
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
    let classType: ClassType<T>;
    let container;
    // if type is () => T
    if (isFunction(typeOrSupplier) && !isStatedBean(typeOrSupplier)) {
      // get the bean
      const supplier = typeOrSupplier as () => T;
      const bean = supplier();
      classType = (bean as any).constructor as ClassType<T>;
      container = new StatedBeanContainer(context.container);
      container.registerBean(classType, bean, { name: option.name });
    } else {
      classType = typeOrSupplier as ClassType<T>;
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
    if (container !== undefined && bean !== undefined) {
      container.on(bean, beanChangeListener);
    }
    return bean;
  });

  if (bean === undefined) {
    throw new Error(`get bean[${classType.name}] error`);
  }

  useEffect(() => {
    return () => container.off(bean, beanChangeListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bean;
}
