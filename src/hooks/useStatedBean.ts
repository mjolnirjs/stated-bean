import { EffectContext, StatedBeanScope, StatedBeanContainer } from '../core';
import { getStatedBeanContext } from '../context';
import { ClassType } from '../types/ClassType';

import { useContext, useState, useEffect, useCallback } from 'react';

export interface UseStatedBeanOption {
  dependentFields: Array<string | symbol>;
  scope: StatedBeanScope;
}

export function useStatedBean<T extends ClassType>(
  type: T,
  option: Partial<UseStatedBeanOption> = {
    dependentFields: [],
    scope: StatedBeanScope.DEFAULT,
  },
): InstanceType<T> {
  const StateBeanContext = getStatedBeanContext();
  const context = useContext(StateBeanContext);

  const getContainer = useCallback(() => {
    let container;

    if (option.scope === StatedBeanScope.CONTEXT) {
      container = context.container;
    } else if (option.scope === StatedBeanScope.REQUEST) {
      container = new StatedBeanContainer();
      container.register(type);
    } else {
      container = context.container || new StatedBeanContainer();
      container.register(type);
    }

    return container;
  }, [option.scope, context.container, type]);
  const [container, setContainer] = useState<StatedBeanContainer | undefined>(
    () => getContainer(),
  );

  if (container === undefined) {
    throw new Error('not found container');
  }

  const [bean, setBean] = useState(() =>
    container.getBean<InstanceType<T>>(type),
  );

  useEffect(() => {
    const container = getContainer();

    if (container) {
      setContainer(container);
      container.register(type);
      setBean(container.getBean<InstanceType<T>>(type));
    }
  }, [getContainer, type]);

  if (bean === undefined) {
    throw new Error(`get bean[${type.name}] error`);
  }

  const [, setVersion] = useState(0);

  useEffect(() => {
    const changeEvent = Symbol.for(bean.constructor.name + '_changed');
    const beanChangeListener = (effect: EffectContext) => {
      // console.log('receive change event', effect);
      const field = effect.fieldMeta.name;
      if (
        option.dependentFields == null ||
        option.dependentFields.length === 0 ||
        option.dependentFields.includes(field)
      ) {
        setVersion(prev => prev + 1);
      }
    };
    container.on(changeEvent, beanChangeListener);
    return () => container.off(changeEvent, beanChangeListener);
  }, [container, bean, option.dependentFields]);

  return bean;
}
