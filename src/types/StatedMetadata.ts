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

export interface PostMethodMeta<T = Function> {
  name: string | symbol;
  target: Function;
  descriptor: TypedPropertyDescriptor<T>;
}
