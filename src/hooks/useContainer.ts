import { StatedBeanContainer, StatedBeanApplication } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType, BeanProvider } from '../types';

import { useState, useEffect, useContext } from 'react';

export interface UseContainerOption {
  types?: Array<ClassType<unknown>>;
  beanProvider?: BeanProvider;
  application?: StatedBeanApplication;
}

export function useContainer({
  types,
  beanProvider,
  application,
}: UseContainerOption) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState(() => {
    return new StatedBeanContainer(context.container, application);
  });

  useEffect(() => {
    console.log('stated-bean register,', (types || []).map(t => t.name));
    (types || []).forEach(type => {
      container.register(type);
    });

    if (beanProvider !== undefined) {
      beanProvider(container.registerBean.bind(container));
    }
  }, [container, types, beanProvider]);
  return container;
}
