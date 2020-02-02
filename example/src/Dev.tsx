import React from 'react';

import { CounterSpeed } from './components/Counter';

import { StatedBeanApplication, StatedBeanProvider } from 'stated-bean';

const app = new StatedBeanApplication();

export const DevApp = () => {
  return (
    <StatedBeanProvider application={app}>
      <CounterSpeed />
    </StatedBeanProvider>
  );
};
