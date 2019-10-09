/* eslint-disable @typescript-eslint/unbound-method */
import { CounterModel } from '../../models/CounterModel';

import React from 'react';
import { useBean } from 'stated-bean';

export interface CounterProps {
  value: number;
}

export function Counter(props: CounterProps) {
  const counter = useBean(CounterModel, { props });
  console.log('counter', counter.count);
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
