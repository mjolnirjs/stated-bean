import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { useContainer } from '../hooks/useContainer';
import { BeanProvider, ClassType } from '../types';

import { getStatedBeanContext } from './StatedBeanContext';

import React from 'react';

export interface StatedBeanProviderProps<T = unknown> {
  types?: Array<ClassType<T>>;
  beans?: T[];
  beanProvider?: BeanProvider;
  application?: StatedBeanApplication;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const StatedBeanProvider: React.FC<StatedBeanProviderProps> = ({
  types,
  beans,
  beanProvider,
  application,
  children,
}) => {
  // TODO: update container
  const StatedBeanContext = getStatedBeanContext();
  const container = useContainer({ types, beans, beanProvider, application });

  return (
    <StatedBeanContext.Provider value={{ container }}>
      {children}
    </StatedBeanContext.Provider>
  );
};
