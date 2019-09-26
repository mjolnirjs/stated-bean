import { StatedBeanApplication } from '../core/StatedBeanApplication';
import { useContainer } from '../hooks/useContainer';
import { Provider } from '../types';

import { getStatedBeanContext } from './StatedBeanContext';

import React from 'react';

export interface StatedBeanProviderProps<T = unknown> {
  providers?: Array<Provider<T>>;
  application?: StatedBeanApplication;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const StatedBeanProvider = ({
  providers,
  application,
  children,
}: StatedBeanProviderProps) => {
  // TODO: update container
  const StatedBeanContext = getStatedBeanContext();
  const container = useContainer({ providers, application });

  return (
    <StatedBeanContext.Provider value={{ container }}>
      {children}
    </StatedBeanContext.Provider>
  );
};
