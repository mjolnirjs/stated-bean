import { StatedBeanContainer } from '../core/StatedBeanContainer';

import React from 'react';

export interface StatedBeanContextValue {
  container?: StatedBeanContainer;
}

let statedBeanContext: React.Context<StatedBeanContextValue>;

export function getStatedBeanContext() {
  if (!statedBeanContext) {
    statedBeanContext = React.createContext<StatedBeanContextValue>({});
  }
  return statedBeanContext;
}
