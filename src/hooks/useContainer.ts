import { getStatedBeanContext } from '../context/StatedBeanContext';
import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { StatedBeanContainer } from '../core/StatedBeanContainer';
import { Provider } from '../types';
import { isFunction } from '../utils';

import { useContext, useEffect, useState } from 'react';

export interface UseContainerOption<T = unknown> {
  providers?: Array<Provider<T>>;
  application?: StatedBeanApplication;
}

/**
 * creates a new `StatedBeanContainer` and registers the `types`, `beans` which given by the `UseContainerOption`.
 */
export function useContainer({ providers, application }: UseContainerOption) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState(() => {
    const container = new StatedBeanContainer(context.container, application);
    (providers || []).forEach(provider => {
      if (isFunction(provider)) {
        container
          .registerAndObserve({
            type: provider,
          })
          .state$.subscribe();
      } else if ('type' in provider) {
        container.registerAndObserve(provider).state$.subscribe();
      }
    });
    return container;
  });

  useEffect(() => {
    return () => {
      container.destroy();
    };
  }, [container]);

  return container;
}
