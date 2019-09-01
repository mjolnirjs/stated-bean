import { StatedBeanMeta, StatedFieldMeta, PostMethodMeta } from '../types';

export class StatedBeanMetaStorage {
  // @internal
  private _beans = new WeakMap<Function, StatedBeanMeta>();

  // @internal
  private _tempTypeFields = new WeakMap<Function, StatedFieldMeta[]>();

  // @internal
  private _tempPostMethod = new WeakMap<Function, PostMethodMeta>();

  collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this._tempTypeFields.get(type);
    bean.statedFields = fields;
    bean.postMethod = this._tempPostMethod.get(type);
    this._beans.set(type, bean);

    this._tempTypeFields.delete(type);
    this._tempPostMethod.delete(type);
  }

  collectStatedField(field: StatedFieldMeta) {
    const type = field.target;
    const fields = this._tempTypeFields.get(type);
    if (fields) {
      fields.push(field);
    } else {
      this._tempTypeFields.set(type, [field]);
    }
  }

  collectPostProvided(method: PostMethodMeta) {
    this._tempPostMethod.set(method.target, method);
  }

  getBeanMeta(type: Function): StatedBeanMeta | undefined {
    return this._beans.get(type);
  }

  clear() {
    this._beans = new WeakMap();
    this._tempTypeFields = new WeakMap();
    this._tempPostMethod = new WeakMap();
  }
}
