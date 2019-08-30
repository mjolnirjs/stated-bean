import { ClassType } from './ClassType';

export interface BeanRegisterOption {
  name?: string | symbol;
}

export type Provide = <T>(
  type: ClassType<T>,
  bean: T | (() => T),
  options?: BeanRegisterOption,
) => {};

export type BeanProvider = (provide: Provide) => void;
