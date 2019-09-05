import { StatedBeanMeta, StatedFieldMeta } from './StatedMetadata';

export interface EffectAction {
  loading: boolean;
  error: unknown;
}

export interface StateChanged<T> {
  newValue: T;
  oldValue: T;
  fieldMeta: StatedFieldMeta;
  beanMeta: StatedBeanMeta;
}
