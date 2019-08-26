import { StatedBeanMeta, StatedFieldMeta, PostMethodMeta } from '../types';

export class StatedBeanMetaStorage {
  private beans: WeakMap<Function, StatedBeanMeta>;

  private tempTypeFields: WeakMap<Function, StatedFieldMeta[]>;

  private tempPostMethod: WeakMap<Function, PostMethodMeta>;

  constructor() {
    this.beans = new WeakMap();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }

  collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this.tempTypeFields.get(type);
    bean.statedFields = fields;
    bean.postMethod = this.tempPostMethod.get(type);
    this.beans.set(type, bean);

    this.tempTypeFields.delete(type);
    this.tempPostMethod.delete(type);
  }

  collectStatedField(field: StatedFieldMeta) {
    const type = field.target;
    const fields = this.tempTypeFields.get(type);
    if (fields) {
      fields.push(field);
    } else {
      this.tempTypeFields.set(type, [field]);
    }
  }

  collectPostProvided(method: PostMethodMeta) {
    this.tempPostMethod.set(method.target, method);
  }

  getBeanMeta(type: Function): StatedBeanMeta | undefined {
    return this.beans.get(type);
  }

  clear() {
    this.beans = new WeakMap();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }
}
