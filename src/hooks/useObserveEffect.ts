import { StatedBeanType, EffectAction } from '../types';
import { StatedBeanSymbol, EffectEvent, EffectEventType } from '../core';

import { useState, useEffect, useCallback } from 'react';

export function useObserveEffect<T>(
  bean: StatedBeanType<T>,
  effect: string | symbol,
) {
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
    const container = bean[StatedBeanSymbol].container;

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
