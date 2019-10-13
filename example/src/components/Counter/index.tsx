/* eslint-disable @typescript-eslint/unbound-method */
import { CounterModel } from '../../models/CounterModel';

import React from 'react';
import { useBean } from 'stated-bean';

export interface CounterProps {
  value: number;
}

// const CounterModel = {
//   count: 10,
//   decrement() {
//     this.count--;
//   },
//   increment() {
//     this.count++;
//   },
// };

export function Counter(props: CounterProps) {
  const counter = useBean(CounterModel, { props });

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
