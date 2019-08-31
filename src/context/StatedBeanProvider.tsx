import { StatedBeanApplication } from '../core';
import { useContainer } from '../hooks';
import { ClassType, BeanProvider } from '../types';

import { getStatedBeanContext } from './StatedBeanContext';

import React from 'react';

export interface StatedBeanProviderProps {
  types?: ClassType[];
  beanProvider?: BeanProvider;
  application?: StatedBeanApplication;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const StatedBeanProvider: React.FC<StatedBeanProviderProps> = ({
  types,
  beanProvider,
  application,
  children,
}) => {
  // TODO: update container
  const StatedBeanContext = getStatedBeanContext();
  const container = useContainer({ types, beanProvider, application });

  return (
    <StatedBeanContext.Provider value={{ container }}>
      {children}
    </StatedBeanContext.Provider>
  );
};
