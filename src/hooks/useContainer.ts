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
    const c = new StatedBeanContainer(context.container, application);
    c.register(...types);
    return c;
  });

  useEffect(() => {
    container.register(...types);
  }, [container, types]);
  return container;
}
