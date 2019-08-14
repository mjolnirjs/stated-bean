import { StatedBeanMeta, StatedFieldMeta, PostMethodMeta } from '../types';

export class StatedBeanMetaStorage {
  private readonly beans: Map<string | symbol, StatedBeanMeta>;

  private tempTypeFields: WeakMap<Function, StatedFieldMeta[]>;

  private tempPostMethod: WeakMap<Function, PostMethodMeta>;

  constructor() {
    this.beans = new Map();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }

  collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this.tempTypeFields.get(type);
    bean.statedFields = fields;
    bean.postMethod = this.tempPostMethod.get(type);
    this.beans.set(bean.name, bean);

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

  getBeanMeta(name: string | symbol): StatedBeanMeta | undefined {
    return this.beans.get(name);
  }

  clear() {
    this.beans.clear();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }
}
