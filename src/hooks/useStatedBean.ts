import { EffectContext } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

import { useContext, useState, useEffect } from 'react';

export function useStatedBean<T>(
  type: ClassType<T>,
  dependentFields?: Array<string | symbol>,
): T {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);

  if (context.container === undefined) {
    throw new Error('not found container');
  }
  const bean = context.container.getBean(type) as any;

  if (bean === undefined) {
    throw new Error('not found bean of ' + type);
  }
  const [, setVersion] = useState(0);

  useEffect(() => {
    const changeEvent = Symbol.for(bean.constructor.name + '_changed');
    const beanChangeListener = (effect: EffectContext) => {
      // console.log('receive change event', effect);
      const field = effect.fieldMeta.name;
      if (dependentFields === undefined) {
        setVersion(prev => prev + 1);
      } else if (dependentFields.includes(field)) {
        setVersion(prev => prev + 1);
      }
    };
    context.container!.on(changeEvent, beanChangeListener);
    return () => {
      context.container!.off(changeEvent, beanChangeListener);
    };
  }, [bean.constructor.name, context.container, dependentFields]);

  return bean;
}
