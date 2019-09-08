import { getStatedBeanContext } from '../context/StatedBeanContext';
import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { StatedBeanContainer } from '../core/StatedBeanContainer';
import { BeanProvider, ClassType, StatedBeanType } from '../types';

import { useContext, useState, useEffect } from 'react';

export interface UseContainerOption {
  types?: ClassType[];
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
