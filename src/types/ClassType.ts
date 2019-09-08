// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ClassType<T = unknown> = new (...args: unknown[]) => T;

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type InstanceType<T extends ClassType> = T extends ClassType<infer R>
  ? R
  : never;
