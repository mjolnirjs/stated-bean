import { CounterModel } from '../../models/CounterModel';

import { useStatedBean, StatedBeanScope } from 'stated-bean';
import React from 'react';

export function Counter() {
  const counter = useStatedBean(CounterModel, {
    scope: StatedBeanScope.REQUEST,
  });

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
