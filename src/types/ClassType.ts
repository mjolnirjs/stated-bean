export type ClassType<T = any> = new (...args: any[]) => T;

export type InstanceType<T extends ClassType<unknown>> = T extends ClassType<
  infer R
>
  ? R
  : never;
