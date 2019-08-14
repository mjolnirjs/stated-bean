import {
  StatedBeanContainer,
  StatedBeanApplication,
  EffectContext,
} from '../core';
import { getStatedBeanContext } from '../context';
import { getMetadataStorage } from '../metadata';
import { ClassType, StatedBeanMeta, StatedFieldMeta } from '../types';

import { useState, useEffect, useContext } from 'react';

function createEffectContext(
  oldValue: any,
  bean: any,
  beanMeta: StatedBeanMeta,
  fieldMeta: StatedFieldMeta,
  container: StatedBeanContainer,
): EffectContext {
  return new EffectContext(oldValue, bean, beanMeta, fieldMeta, container);
}

export function useContainer(
  types: ClassType[],
  application?: StatedBeanApplication,
) {
  const StatedBeanContext = getStatedBeanContext();
  const context = useContext(StatedBeanContext);

  const [container] = useState<StatedBeanContainer>(
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
      );
      initEffect.setValue(bean[fieldMeta.name]);
      await container.application.interceptStateInit(initEffect);

      Object.defineProperty(bean, tempFieldSymbol, {
        writable: true,
        value: initEffect.getValue(),
      });

      Object.defineProperty(bean, fieldMeta.name.toString(), {
        set(value: any) {
          const effect = createEffectContext(
            bean[tempFieldSymbol],
            bean,
            beanMeta,
            fieldMeta,
            container,
          );
          effect.setValue(value);

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
          if (beanMeta.postMethod !== undefined) {
            const f = beanMeta.postMethod.descriptor.value as Function;
            f.apply(bean);
          }
        });
      }
    }
  }, [container]);
  return container;
}
