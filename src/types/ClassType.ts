// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ClassType<T = unknown> = new (...args: unknown[]) => T;

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type InstanceType<T extends ClassType> = T extends ClassType<infer R>
  ? R
  : never;

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
