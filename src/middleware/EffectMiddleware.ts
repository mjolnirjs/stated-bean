import { EffectEvent } from '../core';

export type NextCaller = () => Promise<void>;

export type MiddlewareMethod = (
  context: EffectEvent,
  next: NextCaller,
) => Promise<void>;
