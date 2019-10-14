import { getStatedBeanContext } from '../context';
import { BeanDefinition } from '../core';
import { BeanProvider, ClassType, StateAction } from '../types';
import { isFunction, isStatedBeanClass } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

export type UseBeanOptions<TProps> =
  | string
  | symbol
  | {
      name?: string | symbol;
      props?: TProps;
    };

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
export function useBean<T, TProps = Record<string, unknown>>(
  typeOrSupplier: ClassType<T> | ((props?: TProps) => T),
  option?: UseBeanOptions<TProps>,
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const [, setVersion] = useState(0);

  let name: string | symbol | undefined;
  let props: TProps | undefined;

  if (option !== undefined) {
    if (typeof option === 'object') {
      name = option.name;
      props = option.props;
    } else if (typeof option === 'string' || typeof option === 'symbol') {
      name = option;
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
    let provider: BeanProvider<T, TProps>;
    if (isFunction(typeOrSupplier) && !isStatedBeanClass(typeOrSupplier)) {
      const supplier = typeOrSupplier as () => T;
      const type = supplier.constructor as ClassType<T>;
      provider = { type, factory: supplier, name, props };
    } else {
      provider = {
        type: typeOrSupplier as ClassType<T>,
        name,
        props,
      };
    }
    return container.register(new BeanDefinition(provider));
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
