export type ClassType<T = any> = new (...args: any[]) => T;

export type InstanceType<T extends ClassType> = T extends ClassType<infer R>
  ? R
  : never;
