import { EffectAction, StatedBeanType } from '../types';
import { StatedBeanSymbol, EffectEvent, EffectEventType } from '../core';

import { useState, useEffect, useCallback } from 'react';

export function useObserveEffect<T extends StatedBeanType<unknown>>(
  bean: T,
  effect: string | symbol,
): EffectAction {
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
  const [container] = useState(() => {
    const statedBean = bean as StatedBeanType<unknown>;
    const container = statedBean[StatedBeanSymbol].container;

    container.on(bean, listener);
    return container;
  });

  useEffect(() => {
    return () => {
      container.off(bean, listener);
    };
  }, [container, bean, listener]);
  return effectState;
}
