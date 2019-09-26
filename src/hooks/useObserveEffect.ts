import { getStatedBeanContext } from '../context';
import { EffectEvent, EffectEventType } from '../core';
import { EffectAction, Provider, ClassType, BeanProvider } from '../types';
import { isStatedBean, isFunction } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

export function useObserveEffect<T>(
  bean: T | Provider<T>,
  effect: string | symbol | keyof T,
): EffectAction {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);

  const container = context.container;

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [effectState, setEffectState] = useState<EffectAction>(() => {
    return {
      loading: false,
      error: null,
    };
  });

  const listener = useCallback(
    (event: EffectEvent<T, EffectAction>) => {
      if (
        event.type === EffectEventType.EffectAction &&
        event.name === effect
      ) {
        setEffectState(event.value);
      }
    },
    [effect],
  );

  const [provider] = useState<BeanProvider<T>>(() => {
    let provider: BeanProvider<T>;
    if (isStatedBean(bean)) {
      provider = { type: bean.constructor as ClassType<T>, bean: bean as T };
    } else if (isFunction(bean)) {
      const type = bean as ClassType<T>;
      provider = { type, bean: container.getBean(type) };
    } else if ('type' in bean) {
      provider = { ...bean, bean: container.getBean(bean.type, bean.identity) };
    } else {
      throw new Error('not expect bean provider');
    }
    container.on(provider, listener);
    return provider;
  });

  useEffect(() => {
    return () => {
      if (container && provider) {
        container.off(provider, listener);
      }
    };
  }, [container, provider, listener]);
  return effectState;
}
