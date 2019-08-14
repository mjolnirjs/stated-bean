import { ClassType } from '../types/ClassType';

export interface IBeanFactory {
  get<T>(type: ClassType): T;
}

export class DefaultBeanFactory implements IBeanFactory {
  get<T>(type: ClassType): T {
    return new type();
  }
}
