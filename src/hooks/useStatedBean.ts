import { ClassType } from '../types/ClassType';
import { getStatedBeanContext } from '../context';
import { useContext, useState, useEffect } from 'react';

export function useStatedBean<T>(
  type: ClassType<T>,
  dependentFields?: Array<string | symbol>
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
  const change_event = Symbol.for(bean.constructor.name + '_change');
  const [, setVersion] = useState(0);

  const beanChangeListener = (_bean: T, field: string) => {
    if (dependentFields === undefined) {
      setVersion(prev => prev + 1);
    } else if (dependentFields.includes(field)) {
      setVersion(prev => prev + 1);
    }
  };

  useEffect(() => {
    context.container!.on(change_event, beanChangeListener);

    return () => {
      context.container!.off(change_event, beanChangeListener);
    };
  }, []);

  return bean;
}
