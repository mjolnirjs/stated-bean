import * as React from 'react';

import { ClassType } from '../types/ClassType';
import { IFactory, StatedBeanContainer } from '../container';
import { useContainer } from '../hooks';
import { getStatedBeanContext } from './StatedBeanContext';

export interface StatedBeanProviderProps {
  types: ClassType[];
  beanFactory?: IFactory;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const StatedBeanProvider: React.FC<StatedBeanProviderProps> = ({
  types,
  beanFactory,
  children,
}) => {
  const [container] = React.useState<StatedBeanContainer>(
    () => new StatedBeanContainer(types, beanFactory)
  );

  // TODO: update container
  useContainer(container);

  const StatedBeanContext = getStatedBeanContext();
  return (
    <StatedBeanContext.Consumer>
      {context => {
        const parentContainer = context.container;
        container.setParent(parentContainer);

        return (
          <StatedBeanContext.Provider value={{ container }}>
            {children}
          </StatedBeanContext.Provider>
        );
      }}
    </StatedBeanContext.Consumer>
  );
};
