/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react';

import { CounterModel } from './model';

import { useBean } from 'stated-bean';

export interface CounterProps {
  speed?: number;
}

export function Counter(props: CounterProps = { speed: 1 }) {
  const counter = useBean(CounterModel, { props });

  return <span>Count: {counter.count}</span>;
}

export function CounterSpeed() {
  const [speed, setSpeed] = React.useState(1);

  return (
    <div style={{ margin: '50px auto', display: 'flex', justifyContent: 'center' }}>
      <span>Speed: </span>
      <input
        type="number"
        value={speed}
        onChange={e => {
          setSpeed(Number(e.target.value));
        }}
      />
      <Counter speed={speed} />
    </div>
  );
}
