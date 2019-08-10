import * as React from 'react';

import { useStatedBean } from '../../../../src';
import { CounterController } from '../../controllers/CounterController';

export function Counter() {
  const counter = useStatedBean(CounterController);

  if (counter === undefined) {
    return null;
  }

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
