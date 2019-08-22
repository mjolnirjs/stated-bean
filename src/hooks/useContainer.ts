import { StatedBeanContainer, StatedBeanApplication } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types';

import { useState, useEffect, useContext } from 'react';

export function useContainer(
  types: Array<ClassType<unknown>>,
  application?: StatedBeanApplication,
) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState(() => {
    return new StatedBeanContainer(context.container, application);
  });

  useEffect(() => {
    console.log('stated-bean register,', (types || []).map(t => t.name));
    container.register(...types);
  }, [container, types]);
  return container;
}
