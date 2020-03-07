import { useCallback, useContext, useEffect, useState } from 'react';

import { getStatedBeanContext } from '../context';
import { EffectAction, FunctionPropertyNames, FunctionProperty } from '../types';
import { getBeanWrapper } from '../utils';

/**
 * Observe the effects in the bean
 *
 * @export
 * @template T
 * @param {T} bean
 * @param {FunctionPropertyNames<T>} effect
 * @returns {EffectAction}
 */
export function useObserveEffect<T>(bean: T, effect: FunctionPropertyNames<T> | FunctionProperty<T>): EffectAction {
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
      data: null,
      effect: effect as string | symbol,
    };
  });

  const listener = useCallback(
    (action: EffectAction) => {
      console.log(action.effectTarget === effect);
      if (action.effect === effect || action.effectTarget === effect) {
        setEffectState(action);
      }
    },
    [effect]
  );

  const [subscription] = useState(() => {
    const beanWrapper = getBeanWrapper(bean);

    if (beanWrapper === undefined) {
      throw new Error('bean observer is undefined');
    }
    return beanWrapper.beanObserver!.effect$.subscribe(listener);
  });

  useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [subscription]);
  return effectState;
}
