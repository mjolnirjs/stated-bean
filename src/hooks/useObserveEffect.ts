import { getStatedBeanContext } from '../context';
import { EffectAction } from '../types';

import { useCallback, useContext, useEffect, useState } from 'react';

export function useObserveEffect<T>(
  bean: T,
  effect: keyof T & (string | symbol),
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
      data: null,
      effect,
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
    const observer = container.getBeanObserver(bean);
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
