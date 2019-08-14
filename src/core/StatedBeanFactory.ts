import { ClassType } from '../types/ClassType';

export interface IBeanFactory {
  get<T>(Type: ClassType): T;
}

export class DefaultBeanFactory implements IBeanFactory {
  get<T>(Type: ClassType): T {
    return new Type();
  }
}
