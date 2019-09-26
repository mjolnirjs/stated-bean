import { getStatedBeanContext } from '../context';
import { EffectEvent } from '../core';
import { ClassType, BeanProvider } from '../types';
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

  const [provider] = useState<BeanProvider<T>>(() => {
    let provider: BeanProvider<T>;
    let bean: T | undefined;
    if (isFunction(typeOrSupplier) && !isStatedBean(typeOrSupplier)) {
      const supplier = typeOrSupplier as () => T;
      bean = supplier();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const type = (bean as any).constructor as ClassType<T>;
      if (type.name === 'Object' && (name === undefined || name === null)) {
        throw new Error('plain object bean must be named.');
      }
      provider = { type, bean, identity: name };
    } else {
      provider = { type: typeOrSupplier as ClassType<T>, identity: name };
    }
    container.register(provider);
    bean = container.getBean(provider.type, name);
    provider.bean = bean;
    if (bean === undefined) {
      throw new Error('create bean fail.');
    }
    container.on(provider, beanChangeListener);
    return provider;
  });

  useEffect(() => {
    return () => container.off(provider, beanChangeListener);
  }, [provider, beanChangeListener, container]);

  return provider.bean as T;
}
