import * as React from 'react';

import { StatedBeanApplication } from '../core';
import { useContainer } from '../hooks';
import { getStatedBeanContext } from './StatedBeanContext';
import { ClassType } from '../types/ClassType';

export interface StatedBeanProviderProps {
  types: ClassType[];
  application?: StatedBeanApplication;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const StatedBeanProvider: React.FC<StatedBeanProviderProps> = ({
  types,
  application,
  children,
}) => {
  // TODO: update container
  const StatedBeanContext = getStatedBeanContext();
  const container = useContainer(types, application);

  return (
    <StatedBeanContext.Provider value={{ container }}>
      {children}
    </StatedBeanContext.Provider>
  );
};
