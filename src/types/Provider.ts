import { ClassType } from './ClassType';

export interface BeanProvider<T> {
  type: ClassType<T>;
  identity?: string | symbol;
  bean?: T;
  props?: Record<string, unknown>;
}

export interface StrictBeanProvider<T> extends BeanProvider<T> {
  type: ClassType<T>;
  identity: string | symbol;
  bean: T;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type TypedProvider<T> = ClassType<T>;

export type Provider<T> = TypedProvider<T> | BeanProvider<T>;
