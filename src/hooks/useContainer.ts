import { getStatedBeanContext } from '../context';
import { StatedBeanApplication, StatedBeanContainer } from '../core';
import { BeanProvider, ClassType } from '../types';

import { useContext, useState, useEffect } from 'react';
import { StatedBeanType } from 'src/types/StatedBeanType';

export interface UseContainerOption {
  types?: Array<ClassType<unknown>>;
  beans?: Array<StatedBeanType<unknown>>;
  beanProvider?: BeanProvider;
  application?: StatedBeanApplication;
}

/**
 * creates a new `StatedBeanContainer` and registers the `types`, `beans` which given by the `UseContainerOption`.
 *
 * @export
 * @param {UseContainerOption} {
 *   types,
 *   beans,
 *   beanProvider,
 *   application,
 * }
 * @returns
 */
export function useContainer({
  types,
  beans,
  beanProvider,
  application,
}: UseContainerOption) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState(() => {
    const container = new StatedBeanContainer(context.container, application);

    (types || []).forEach(type => {
      container.register(type);
    });

    (beans || []).forEach(bean => {
      container.addBean(bean);
    });

    if (beanProvider !== undefined) {
      beanProvider(container.registerBean.bind(container));
    }
    return container;
  });

  useEffect(() => {
    return () => {
      container.destroy();
    };
  }, [container]);

  return container;
}
