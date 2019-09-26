import { getStatedBeanContext } from '../context/StatedBeanContext';
import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { StatedBeanContainer } from '../core/StatedBeanContainer';
import { Provider, ClassType } from '../types';
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
        container.register({
          type: provider as ClassType,
        });
      } else if ('type' in provider) {
        container.register(provider);
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
