import { StatedBeanContainer } from '../container';
import { getMetadataStorage } from '../metadata';

export function useContainer(container: StatedBeanContainer) {
  if (!container.isHooked()) {
    const beanTypes = container.getAllBeanTypes();
    const storage = getMetadataStorage();

    for (let t = 0; t < beanTypes.length; t++) {
      const type = beanTypes[t];
      const beanMeta = storage.getBeanMeta(type.name);
      const bean = container.getBean(type);

      if (beanMeta && bean) {
        const fields = beanMeta.statedFields || [];
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          const tempFieldSymbol = Symbol(field.name.toString() + '_version');

          Object.defineProperty(bean, tempFieldSymbol, {
            writable: true,
            value: bean[field.name],
          });

          Object.defineProperty(bean, field.name.toString(), {
            set(value: any) {
              bean[tempFieldSymbol] = value;
              container.emit(
                Symbol.for(bean.constructor.name + '_change'),
                bean,
                field.name
              );
            },
            get() {
              return bean[tempFieldSymbol];
            },
          });
        }
      }
    }
    container.setHooked(true);
  }
  return null;
}
