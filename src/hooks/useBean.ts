import { getStatedBeanContext } from '../context';
import { EffectEvent } from '../core';
import { ClassType } from '../types';
import { isFunction, isStatedBean } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

/**
 * creates a temporary `StatedBeanContainer` and registers the bean to the container.
 *
 * and add listener watch the `EffectContext` from the container to change the stated `version`.
 *
 * it will be destroyed when the used component unmounted.
 *
 * @export
 * @template T
 * @param {(ClassType<T> | (() => T))} typeOrSupplier
 * @param {(string | symbol)} [name]
 * @returns {StatedBeanType<T>}
 */
export function useBean<T>(
  typeOrSupplier: ClassType<T> | (() => T),
  name?: string | symbol,
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  const beanChangeListener = useCallback((_effect: EffectEvent) => {
    setVersion(prev => prev + 1);
  }, []);

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found stated bean container.');
  }

  const [bean] = useState<T>(() => {
    let bean: T;
    let classType: ClassType<T>;
    if (isFunction(typeOrSupplier) && !isStatedBean(typeOrSupplier)) {
      const supplier = typeOrSupplier as () => T;
      bean = supplier();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      classType = (bean as any).constructor as ClassType<T>;
      if (
        classType.name === 'Object' &&
        (name === undefined || name === null)
      ) {
        throw new Error('plain object bean must be named.');
      }
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
