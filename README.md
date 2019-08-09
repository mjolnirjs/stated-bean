# stated-bean

## Introduction

stated-bean is a scalable state management lib with react hooks.

## Features

* ...

## Usage

<details open>
<summary><b>Stated Bean</b></summary>
```ts
import { StatedBean, Stated } from 'stated-bean';

@StatedBean()
export class Counter {

  @Stated()
  public count: number = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
```
</details>

<details open>
<summary><b>StatedBeanProvider</b></summary>

```ts
import { StatedBeanProvider } from '../src';

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
```
</details>

<details open>
<summary><b>useStatedBean</b></summary>

```ts
import { useStatedBean } from '../src';

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
```
</details>
