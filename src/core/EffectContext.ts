import { StatedBeanMeta, StatedFieldMeta } from '../types';

import { StatedBeanContainer } from './StatedBeanContainer';

export class EffectContext<Bean = unknown, Value = unknown> {
  constructor(
    private readonly _oldValue: Value,
    private readonly _bean: Bean,
    private readonly _beanMeta: StatedBeanMeta,
    private readonly _fieldMeta: StatedFieldMeta,
    private readonly _container: StatedBeanContainer,
    private _value?: Value,
  ) {}

  get bean(): Bean {
    return this._bean;
  }

  get beanMeta(): StatedBeanMeta {
    return this._beanMeta;
  }

  get fieldMeta(): StatedFieldMeta {
    return this._fieldMeta;
  }

  get oldValue(): Value {
    return this._oldValue;
  }

  get container(): StatedBeanContainer {
    return this._container;
  }

  setValue(value: Value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  toString() {
    return `[${this.beanMeta.name}] ${String(this.fieldMeta.name)} ${
      this.oldValue
    } => ${this._value}`;
  }
}
