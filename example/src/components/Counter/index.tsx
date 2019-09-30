/* eslint-disable @typescript-eslint/unbound-method */
import { useBean } from 'stated-bean';
import React from 'react';

export function Counter() {
  const counter = useBean(
    () => ({
      count: 1,
      decrement() {
        this.count++;
      },
      increment() {
        this.count--;
      },
    }),
    'counter',
  );
  console.log('counter', counter);
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
