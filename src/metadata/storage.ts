import {
  StatedBeanMeta,
  StatedFieldMeta,
  PostMethodMeta,
  PropsFieldMeta,
} from '../types';

export class StatedBeanMetaStorage {
  // @internal
  private _beans = new WeakMap<Function, StatedBeanMeta>();

  // @internal
  private _statedFields = new WeakMap<Function, StatedFieldMeta[]>();

  // @internal
  private _propsFields = new WeakMap<Function, PropsFieldMeta[]>();

  // @internal
  private _postMethod = new WeakMap<Function, PostMethodMeta>();

  collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this._statedFields.get(type);
    bean.statedFields = fields;
    bean.propsFields = this._propsFields.get(type);
    bean.postMethod = this._postMethod.get(type);
    this._beans.set(type, bean);

    this._statedFields.delete(type);
    this._propsFields.delete(type);
    this._postMethod.delete(type);
  }

  collectStatedField(field: StatedFieldMeta) {
    const type = field.target;
    const fields = this._statedFields.get(type);
    if (fields) {
      fields.push(field);
    } else {
      this._statedFields.set(type, [field]);
    }
  }

  collectPropsField(field: PropsFieldMeta) {
    const type = field.target;
    const fields = this._propsFields.get(type);
    if (fields) {
      fields.push(field);
    } else {
      this._propsFields.set(type, [field]);
    }
  }

  collectPostProvided(method: PostMethodMeta) {
    this._postMethod.set(method.target, method);
  }

  getBeanMeta(type: Function): StatedBeanMeta | undefined {
    return this._beans.get(type);
  }

  clear() {
    this._beans = new WeakMap();
    this._statedFields = new WeakMap();
    this._propsFields = new WeakMap();
    this._postMethod = new WeakMap();
  }
}
