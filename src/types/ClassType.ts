// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-type-alias
export type ClassType<T = unknown> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type InstanceType<T extends ClassType> = T extends ClassType<infer R>
  ? R
  : never;
