import { CounterModel } from '../../models/CounterModel';

import { useBean } from 'stated-bean';
import React from 'react';

export function Counter() {
  const counter = useBean(() => new CounterModel(10));

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
