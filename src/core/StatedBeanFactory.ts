import { ClassType } from '../types';

export interface IBeanFactory {
  get<T>(Type: ClassType<T>): T | undefined;
}

export class DefaultBeanFactory implements IBeanFactory {
  get<T>(Type: ClassType<T>): T | undefined {
    return new Type();
  }
}
