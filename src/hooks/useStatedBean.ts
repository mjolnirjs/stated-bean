import { EffectContext } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

import { useContext, useState, useEffect } from 'react';

export function useStatedBean<T extends ClassType>(
  type: T,
  dependentFields?: Array<string | symbol>,
): InstanceType<T> {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);

  if (context.container == null) {
    throw new Error('not found container');
  }
  const bean = context.container.getBean<InstanceType<T>>(type);

  if (bean == null) {
    throw new Error('not found bean of ' + type);
  }

  const [, setVersion] = useState(0);

  useEffect(() => {
    const changeEvent = Symbol.for(bean.constructor.name + '_changed');
    const beanChangeListener = (effect: EffectContext) => {
      // console.log('receive change event', effect);
      const field = effect.fieldMeta.name;
      if (dependentFields == null || dependentFields.includes(field)) {
        setVersion(prev => prev + 1);
      }
    };
    context.container!.on(changeEvent, beanChangeListener);
    return () => context.container!.off(changeEvent, beanChangeListener);
  }, [bean.constructor.name, context.container, dependentFields]);

  return bean;
}
