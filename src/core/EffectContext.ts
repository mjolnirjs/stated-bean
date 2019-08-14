import { StatedBeanMeta, StatedFieldMeta } from '../types';
import { StatedBeanContainer } from './StatedBeanContainer';

export class EffectContext {
  private readonly _bean: unknown;
  private readonly _beanMeta: StatedBeanMeta;
  private readonly _fieldMeta: StatedFieldMeta;
  private readonly _oldValue: unknown;
  private readonly _container: StatedBeanContainer;

  private _value: unknown;

  constructor(
    oldValue: unknown,
    bean: unknown,
    beanMeta: StatedBeanMeta,
    fieldMeta: StatedFieldMeta,
    container: StatedBeanContainer
  ) {
    this._oldValue = oldValue;
    this._bean = bean;
    this._beanMeta = beanMeta;
    this._fieldMeta = fieldMeta;
    this._container = container;
  }

  get bean(): unknown {
    return this._bean;
  }

  get beanMeta(): StatedBeanMeta {
    return this._beanMeta;
  }

  get fieldMeta(): StatedFieldMeta {
    return this._fieldMeta;
  }

  get oldValue(): unknown {
    return this._oldValue;
  }

  get container(): StatedBeanContainer {
    return this._container;
  }

  setValue(value: any) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  toString() {
    return `[${this.beanMeta.name}] ${this.fieldMeta.name.toString()} ${String(
      this.oldValue
    )} => ${String(this._value)}`;
  }
}
