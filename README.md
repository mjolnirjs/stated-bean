# stated-bean

[![Travis](https://img.shields.io/travis/com/mjolnirjs/stated-bean.svg)](https://travis-ci.com/mjolnirjs/stated-bean)
[![Codecov](https://img.shields.io/codecov/c/gh/mjolnirjs/stated-bean)](https://codecov.io/gh/mjolnirjs/stated-bean)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fmjolnirjs%2Fstated-bean%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/v/stated-bean.svg)](https://www.npmjs.com/package/stated-bean)
[![GitHub release](https://img.shields.io/github/release/mjolnirjs/stated-bean)](https://github.com/mjolnirjs/stated-bean/releases)

[![David Peer](https://img.shields.io/david/peer/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean?type=peer)
[![David](https://img.shields.io/david/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean)
[![David Dev](https://img.shields.io/david/dev/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

## Introduction

stated-bean is a lite & scalable state management library with react hooks. Inspired by [unstated-next](https://github.com/jamiebuilds/unstated-next)

## Install

```
npm install stated-bean
```

## Features

- OOP: easily integrated with DI(dependency inject) framework together
- Familiar API: just provider and hooks
- Small size: ~3kb (zipped ~1kb)
- Written in TypeScript

## API

`@StatedBean() @Stated() @PostProvided`

- @StatedBean - the stated class.
- @Stated - the stated fields.
- @PostProvided - the method with @PostProvided will be invoked in `useEffect(..., [])`

`<StatedBeanProvider types={[CounterModel]}>`

The `StatedBeanProvider` is responsible for creating an instance of the stated bean and throwing an event after capturing its data changes.

`useStatedBean(CounterModel)`

The `useStatedBean` will find an instance of the stated bean from the context and listen for its data changes to trigger the re-rendering of the current component.

## Usage

### Online Example

- [Counter Example](https://codesandbox.io/embed/stated-bean-counter-example-116tu)
- [Todo Example with InversifyJS](https://codesandbox.io/embed/stated-bean-todo-example-2w104)

<details open>
<summary><b>write a class with @StatedBean</b></summary>

```ts
import { StatedBean, Stated } from 'stated-bean';

@StatedBean()
export class Counter {
  @Stated()
  count: number = 0;

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
<summary><b>use StatedBeanProvider</b></summary>

```ts
import { StatedBeanProvider } from 'stated-bean';

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
<summary><b>get the instance from useStatedBean</b></summary>

```ts
import { useStatedBean } from 'stated-bean';

function CounterDisplay() {
  const counter = useStatedBean(Counter);

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

## License

MIT
