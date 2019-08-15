import { ClassType } from '../types';

export interface IBeanFactory {
  get<T>(Type: ClassType<T>): T;
}

export class DefaultBeanFactory implements IBeanFactory {
  get<T>(Type: ClassType<T>): T {
    return new Type();
  }
}
