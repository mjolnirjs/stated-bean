export enum EffectEventType {
  StateChanged = 'StateChanged',
  EffectAction = 'EffectAction',
}

export class EffectEvent<Bean = unknown, Value = unknown> {
  constructor(
    readonly target: Bean,
    readonly type: EffectEventType,
    readonly name: string | symbol,
    readonly value: Value,
  ) {
    this.target = target;
    this.type = type;
    this.name = name;
    this.value = value;
  }
}
