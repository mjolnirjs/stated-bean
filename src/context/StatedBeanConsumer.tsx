import React from 'react';

import {
  StatedBeanContextValue,
  getStatedBeanContext,
} from './StatedBeanContext';

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
