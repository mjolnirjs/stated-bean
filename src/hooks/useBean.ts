import { getStatedBeanContext } from '../context';
import { BeanProvider, ClassType, StateAction } from '../types';
import { isFunction, isStatedBean } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

export interface UseBeanOptions {
  name?: string | symbol;
  props?: Record<string, unknown>;
}

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
 * @returns {T}
 */
export function useBean<T>(
  typeOrSupplier: ClassType<T> | (() => T),
  option?: string | symbol | UseBeanOptions,
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  let name: string | symbol | undefined;
  let props: Record<string, unknown> | undefined;

  if (option !== undefined) {
    if (typeof option === 'object') {
      name = option.name;
      props = option.props;
    } else if (typeof option === 'string' || typeof option === 'symbol') {
      name = option;
    } else {
      throw new Error('invalid UseBeanOptions');
    }
  }

  const beanChangeListener = useCallback((_action: StateAction) => {
    setVersion(prev => prev + 1);
  }, []);

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found stated bean container.');
  }

  const [observer] = useState(() => {
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
      provider = { type, bean, identity: name, props };
    } else {
      provider = {
        type: typeOrSupplier as ClassType<T>,
        identity: name,
        props,
      };
    }
    return container.registerAndObserve(provider);
  });

  const [subscription] = useState(() => {
    return observer.state$.subscribe(beanChangeListener);
  });

  useEffect(() => {
    observer.props$.next(props);
  }, [props, observer]);

  useEffect(() => {
    return () => subscription.unsubscribe();
  }, [subscription]);

  return observer.proxy;
}
