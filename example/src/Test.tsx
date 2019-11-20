import React from 'react';

import { Counter } from './components/Counter';

import { StatedBeanApplication, StatedBeanProvider } from 'stated-bean';

const app = new StatedBeanApplication();

export const Test = () => {
  return (
    <StatedBeanProvider application={app}>
      <Counter value={10} />
    </StatedBeanProvider>
  );
};
