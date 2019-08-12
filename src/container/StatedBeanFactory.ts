import { ClassType } from '../types/ClassType';

export interface IFactory {
  get<T>(type: ClassType): T;
}

export class DefaultFactory implements IFactory {
  get<T>(type: ClassType): T {
    return new type();
  }
}
