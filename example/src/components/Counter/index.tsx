import * as React from 'react';

import { useStatedBean } from '../../../../src';
import { CounterModel } from '../../models/CounterModel';

export function Counter() {
  const counter = useStatedBean(CounterModel);

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
