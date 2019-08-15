import { EffectContext } from '../core';

export type NextCaller = () => Promise<void>;

export type InterceptMethod = (
  context: EffectContext,
  next: NextCaller,
) => Promise<void>;

export interface StatedInterceptor {
  stateInit: InterceptMethod;
  stateChange: InterceptMethod;
}
