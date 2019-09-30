import { getStatedBeanContext } from '../context';
import { StatedBeanSymbol } from '../core';
import { EffectAction, FunctionPropertyNames } from '../types';
import { isStatedBean } from '../utils';

import { useCallback, useContext, useEffect, useState } from 'react';

/**
 * Observe the effects in the bean
 *
 * @export
 * @template T
 * @param {T} bean
 * @param {FunctionPropertyNames<T>} effect
 * @returns {EffectAction}
 */
export function useObserveEffect<T>(
  bean: T,
  effect: FunctionPropertyNames<T> | string | symbol,
): EffectAction {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);
  const container = context.container;

  if (container === undefined) {
    throw new Error('not found container');
  }

  let identity: string | symbol;
  if (isStatedBean(bean)) {
    identity = bean[StatedBeanSymbol].identity;
  } else {
    throw new Error('bean is not a StatedBean');
  }

  const [effectState, setEffectState] = useState<EffectAction>(() => {
    return {
      loading: false,
      error: null,
      data: null,
      effect: effect as string | symbol,
    };
  });

  const listener = useCallback(
    (action: EffectAction) => {
      if (action.effect === effect) {
        setEffectState(action);
      }
    },
    [effect],
  );

  const [subscription] = useState(() => {
    const observer = container.getBeanObserver(bean.constructor, identity);
    if (observer === undefined) {
      throw new Error('bean observer is undefined');
    }
    return observer.effect$.subscribe(listener);
  });

  useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [subscription]);
  return effectState;
}
