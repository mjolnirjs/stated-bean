import { useStatedBean } from 'stated-bean';
import  React from 'react';

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
