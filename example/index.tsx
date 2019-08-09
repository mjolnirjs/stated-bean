import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StatedBeanProvider, useStatedBean } from '../src';
import { Counter } from './Counter';

function CounterDisplay() {
  const counter = useStatedBean(Counter);

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

const App = () => {
  return (
    <StatedBeanProvider types={[Counter]}>
      <div>
        <CounterDisplay />
      </div>
      <CounterDisplay />

      <StatedBeanProvider types={[Counter]}>
        <CounterDisplay />
      </StatedBeanProvider>
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
