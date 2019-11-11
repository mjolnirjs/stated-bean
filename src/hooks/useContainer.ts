import { useContext, useEffect, useState } from 'react';

import { getStatedBeanContext } from '../context/StatedBeanContext';
import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { StatedBeanContainer } from '../core/StatedBeanContainer';
import { Provider, BeanProvider, ClassType } from '../types';
import { isFunction, isStatedBeanClass } from '../utils';
import { BeanDefinition } from '../core';

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
      let beanProvider: BeanProvider<unknown>;
      if (isFunction(provider)) {
        if (!isStatedBeanClass(provider)) {
          beanProvider = {
            type: provider.constructor as ClassType,
            factory: (provider as unknown) as () => unknown,
          };
        } else {
          beanProvider = {
            type: provider,
          };
        }
      } else {
        beanProvider = provider;
      }
      // Subscribing to the bean makes it not destroyed
      container.register(new BeanDefinition(beanProvider)).state$.subscribe();
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
