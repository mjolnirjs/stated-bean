export interface StatedBeanMeta {
  name?: string | symbol;
  target: Function;
  singleton?: boolean;
  statedFields?: StatedFieldMeta[];
  propsFields?: PropsFieldMeta[];
  postMethod?: PostMethodMeta;
}

export interface StatedFieldMeta {
  name: string | symbol;
  target: Function;
}

export interface PropsFieldMeta {
  name: string | symbol;
  prop: string;
  target: Function;
  observable: boolean;
}

export interface PostMethodMeta<T = Function> {
  name: string | symbol;
  target: Function;
  descriptor: TypedPropertyDescriptor<T>;
}
