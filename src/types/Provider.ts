import { ClassType } from './ClassType';

export interface BeanProvider<T, TProps = unknown> {
  type: ClassType<T>;
  name?: string | symbol;
  factory?: (props?: TProps) => T;
  props?: TProps;
  singleton?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type TypedProvider<T> = ClassType<T>;

export type Provider<T> = TypedProvider<T> | BeanProvider<T>;
