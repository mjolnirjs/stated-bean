/* eslint-disable @typescript-eslint/unbound-method */
import { map } from 'rxjs/operators';

import { CounterModel } from '../../models/CounterModel';

import React from 'react';
import { useBean, useObservable } from 'stated-bean';

export interface CounterProps {
  value: number;
}

export function Counter(props: CounterProps) {
  const counter = useBean(CounterModel, { props });
  console.log('counter', counter.count);

  const value = useObservable(() => counter.value$.pipe(map(v => v * v)));

  console.log('value', value);
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
