import { EffectContext } from '../core';

export type NextCaller = () => Promise<void>;
export type InterceptMethod = (
  context: EffectContext,
  next: NextCaller,
) => Promise<void>;

export interface StatedInterceptor {
  stateInitIntercept(context: EffectContext, next: NextCaller): Promise<void>;

  stateChangeIntercept(context: EffectContext, next: NextCaller): Promise<void>;
}
