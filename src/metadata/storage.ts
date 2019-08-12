export interface StatedBeanMeta {
  name: string;
  target: Function;
  statedFields?: StatedFieldMeta[];
  postMethod?: PostMethodMeta;
}

export interface StatedFieldMeta {
  name: string | symbol;
  target: Function;
}

export interface PostMethodMeta {
  name: string | symbol;
  target: Function;
  descriptor: TypedPropertyDescriptor<unknown>;
}

export class StatedBeanMetaStorage {
  private beans: Map<string | symbol, StatedBeanMeta>;
  private tempTypeFields: WeakMap<Function, StatedFieldMeta[]>;
  private tempPostMethod: WeakMap<Function, PostMethodMeta>;

  public constructor() {
    this.beans = new Map();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }

  public collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this.tempTypeFields.get(type);
    bean.statedFields = fields;
    bean.postMethod = this.tempPostMethod.get(type);
    this.beans.set(bean.name, bean);

    this.tempTypeFields.delete(type);
    this.tempPostMethod.delete(type);
  }

  public collectStatedField(field: StatedFieldMeta) {
    const type = field.target;
    const fields = this.tempTypeFields.get(type);
    if (fields) {
      fields.push(field);
    } else {
      this.tempTypeFields.set(type, [field]);
    }
  }

  public collectPostProvided(method: PostMethodMeta) {
    this.tempPostMethod.set(method.target, method);
  }

  public getBeanMeta(name: string | symbol): StatedBeanMeta | undefined {
    return this.beans.get(name);
  }

  public clear() {
    this.beans.clear();
    this.tempTypeFields = new WeakMap();
    this.tempPostMethod = new WeakMap();
  }
}
