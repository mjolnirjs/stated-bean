import * as React from 'react';
import { StatedBeanContainer } from '../container';

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
