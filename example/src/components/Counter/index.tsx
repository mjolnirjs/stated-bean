/* eslint-disable @typescript-eslint/unbound-method */
import { CounterModel } from '../../models/CounterModel';

import React from 'react';
import { useBean } from 'stated-bean';

export function Counter() {
  const counter = useBean(CounterModel);

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
