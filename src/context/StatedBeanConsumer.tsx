import {
  StatedBeanContextValue,
  getStatedBeanContext,
} from './StatedBeanContext';

import React from 'react';

export interface StatedBeanConsumerProps {
  children: (context: StatedBeanContextValue) => React.ReactNode;
}

export const StatedBeanConsumer: React.FC<StatedBeanConsumerProps> = ({
  children,
}) => {
  const StatedBeanContext = getStatedBeanContext();
  return (
    <StatedBeanContext.Consumer>
      {context => children(context)}
    </StatedBeanContext.Consumer>
  );
};
