import { useContext, useState, useEffect } from 'react';

import { EffectContext } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

export function useStatedBean<T>(
  type: ClassType<T>,
  dependentFields?: Array<string | symbol>
): T {
  console.log('useStatedBean', type.name);

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
    const change_event = Symbol.for(bean.constructor.name + '_changed');
    const beanChangeListener = (effect: EffectContext) => {
      // console.log('receive change event', effect);
      const field = effect.fieldMeta.name;
      if (dependentFields === undefined) {
        setVersion(prev => prev + 1);
      } else if (dependentFields.includes(field)) {
        setVersion(prev => prev + 1);
      }
    };
    context.container!.on(change_event, beanChangeListener);
    return () => {
      context.container!.off(change_event, beanChangeListener);
    };
  }, []);

  return bean;
}
