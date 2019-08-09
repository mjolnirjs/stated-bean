export interface StatedBeanMeta {
  name: string;
  target: Function;
  statedFields?: StatedFieldMeta[];
}

export interface StatedFieldMeta {
  name: string | symbol;
  target: Function;
}

export class StatedBeanMetaStorage {
  private beans: Map<string | symbol, StatedBeanMeta>;
  private tempTypeFields: WeakMap<Function, StatedFieldMeta[]>;

  public constructor() {
    this.beans = new Map();
    this.tempTypeFields = new WeakMap();
  }

  public collectStatedBean(bean: StatedBeanMeta) {
    const type = bean.target;
    const fields = this.tempTypeFields.get(type);
    bean.statedFields = fields;
    this.beans.set(bean.name, bean);

    this.tempTypeFields.delete(type);
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

  public getBeanMeta(name: string | symbol): StatedBeanMeta | undefined {
    return this.beans.get(name);
  }
}
