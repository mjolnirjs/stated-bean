import { StatedFieldMeta } from './StatedMetadata';

export interface StateAction<T = unknown> {
  bean: T;
  nextValue: unknown;
  prevValue: unknown;
  fieldMeta: StatedFieldMeta;
}

export interface EffectAction<T = unknown> {
  loading: boolean;
  error: unknown;
  data: T;
  effect: string | symbol;
}

export interface LifeCycleAction<T = unknown> {
  bean: T;
  action: 'Initialized' | 'Destroyed';
}
