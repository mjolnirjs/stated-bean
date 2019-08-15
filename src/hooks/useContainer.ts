import {
  StatedBeanContainer,
  StatedBeanApplication,
  EffectContext,
} from '../core';
import { getStatedBeanContext } from '../context';
import { getMetadataStorage } from '../metadata';
import { ClassType, StatedBeanMeta, StatedFieldMeta } from '../types';

import { useState, useEffect, useContext } from 'react';

function createEffectContext<Bean, Value>(
  oldValue: Value,
  bean: Bean,
  beanMeta: StatedBeanMeta,
  fieldMeta: StatedFieldMeta,
  container: StatedBeanContainer,
  value?: Value,
): EffectContext {
  return new EffectContext(
    oldValue,
    bean,
    beanMeta,
    fieldMeta,
    container,
    value,
  );
}

export function useContainer<T>(
  types: Array<ClassType<T>>,
  application?: StatedBeanApplication,
) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState(
    () => new StatedBeanContainer(types, context.container, application),
  );

  useEffect(() => {
    const beanTypes = container.getAllBeanTypes();
    const storage = getMetadataStorage();

    const fieldDefine = async (
      fieldMeta: StatedFieldMeta,
      bean: any,
      beanMeta: StatedBeanMeta,
    ) => {
      const tempFieldSymbol = Symbol(fieldMeta.name.toString() + '_version');

      const initEffect = createEffectContext(
        bean[tempFieldSymbol],
        bean,
        beanMeta,
        fieldMeta,
        container,
        bean[fieldMeta.name],
      );
      await container.application.interceptStateInit(initEffect);

      Object.defineProperty(bean, tempFieldSymbol, {
        writable: true,
        value: initEffect.getValue(),
      });

      Object.defineProperty(bean, fieldMeta.name.toString(), {
        set(value) {
          const effect = createEffectContext(
            bean[tempFieldSymbol],
            bean,
            beanMeta,
            fieldMeta,
            container,
            value,
          );

          container.application.interceptStateChange(effect).then(() => {
            bean[tempFieldSymbol] = effect.getValue();
            // console.log(bean.constructor.name + '_changed');
            container.emit(
              Symbol.for(bean.constructor.name + '_changed'),
              effect,
            );
          });
        },
        get() {
          return bean[tempFieldSymbol];
        },
      });
    };

    for (const type of beanTypes) {
      const beanMeta = storage.getBeanMeta(type.name);
      const bean = container.getBean(type);

      if (beanMeta && bean) {
        const fields = beanMeta.statedFields || [];
        const defines = (fields || []).map(field =>
          fieldDefine(field, bean, beanMeta),
        );

        Promise.all(defines).then(() => {
          if (beanMeta.postMethod != null) {
            const f = beanMeta.postMethod.descriptor.value;
            f!.apply(bean);
          }
        });
      }
    }
  }, [container]);
  return container;
}
