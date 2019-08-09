import { ClassType } from '../types/ClassType';

export interface IFactory {
  create<T>(type: ClassType): T;
}

export class DefaultFactory implements IFactory {
  create<T>(type: ClassType): T {
    return new type();
  }
}
