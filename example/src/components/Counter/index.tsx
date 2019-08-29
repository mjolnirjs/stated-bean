import { CounterModel } from '../../models/CounterModel';

import { useStatedBean } from 'stated-bean';
import React from 'react';

export function Counter() {
  const counter = useStatedBean(() => new CounterModel(10));

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
