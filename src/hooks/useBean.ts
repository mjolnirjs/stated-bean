import { getStatedBeanContext } from '../context';
import { EffectContext, StatedBeanContainer } from '../core';
import { ClassType, StatedBeanType } from '../types';
import { isFunction, isStatedBean } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

export function useBean<T>(
  typeOrSupplier: ClassType<T> | (() => T),
  name?: string | symbol,
): StatedBeanType<T> {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback((_effect: EffectContext) => {
    setVersion(prev => prev + 1);
  }, []);

  const [container] = useState(() => {
    const container = new StatedBeanContainer(context.container);

    return container;
  });

  const [bean] = useState<StatedBeanType<T>>(() => {
    let bean: StatedBeanType<T>;
    let classType: ClassType<T>;
    if (isFunction(typeOrSupplier) && !isStatedBean(typeOrSupplier)) {
      const supplier = typeOrSupplier as () => T;
      bean = supplier() as StatedBeanType<T>;
      classType = (bean as any).constructor as ClassType<T>;
      container.registerBean(classType, bean, { name });
    } else {
      classType = typeOrSupplier as ClassType<T>;
      container.register(classType, { name });
      bean = container.getBean(classType)!;
    }
    container.on(bean, beanChangeListener);
    return bean;
  });

  useEffect(() => {
    return () => container.off(bean, beanChangeListener);
  }, [bean, beanChangeListener, container]);

  return bean;
}
