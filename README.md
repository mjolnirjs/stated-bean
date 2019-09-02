# stated-bean

[![Travis](https://img.shields.io/travis/com/mjolnirjs/stated-bean.svg)](https://travis-ci.com/mjolnirjs/stated-bean)
[![Codecov](https://img.shields.io/codecov/c/gh/mjolnirjs/stated-bean)](https://codecov.io/gh/mjolnirjs/stated-bean)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fmjolnirjs%2Fstated-bean%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/stated-bean)
[![npm](https://img.shields.io/npm/v/stated-bean.svg)](https://www.npmjs.com/package/stated-bean)
[![GitHub release](https://img.shields.io/github/release/mjolnirjs/stated-bean)](https://github.com/mjolnirjs/stated-bean/releases)

[![David Peer](https://img.shields.io/david/peer/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean?type=peer)
[![David](https://img.shields.io/david/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean)
[![David Dev](https://img.shields.io/david/dev/mjolnirjs/stated-bean.svg)](https://david-dm.org/mjolnirjs/stated-bean?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

> A light but scalable state management library with react hooks, inspired by [unstated-next](https://github.com/jamiebuilds/unstated-next).

`stated-bean` is a lightweight state management library that allows you to manage the state data of multiple views together. Make cross-component data transfer simple.

## Install

```sh
# yarn
yarn add stated-bean

# npm
npm i stated-bean
```

## Features

- OOP: easy to integrate with DI(dependency inject) framework together
- Familiar API: just provider and hooks
- Small size: ~3kb (zipped ~1kb)
- Written in TypeScript

## Online Demo

[GitHub Pages](https://mjolnirjs.github.io/stated-bean): Integration with [injection-js](https://github.com/mgechev/injection-js)

## Usage

```ts
import { StatedBean, Stated, useStatedBean } from 'stated-bean';

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

## API

### Decorators

#### `@StatedBean(name?: string | symbol): ClassDecorator`

Indicates that an annotated class is a `StatedBean`. The `name` may indicate a suggestion for the bean name. Its default value is `Class.name`.

#### `@Stated(): PropertyDecorator`

Indicates that an annotated property is `Stated`. Its reassignment will be observed and notified to the container.

#### `@PostProvided(): MethodDecorator`

The `PostProvided` decorator is used on a method that needs to be executed after the `StatedBean` be instanced to perform any initialization.

### use Hooks

#### `useStatedBean<T>(type: ClassType<T> | () => T, option?: UseStatedBeanOption): T`

The `useStatedBean` will get/create an instance of the stated bean from the context and listen for its data changes to trigger the re-rendering of the current component.

##### Get the instance from the container in the `React Context`

```tsx
function SampleComponent() {
  const model = useStatedBean(UserModel);

  return; //...;
}

function App() {
  return (
    <StatedBeanProvider types={[UserModel]}>
      <SampleComponent />
    </StatedBeanProvider>
  );
}
```

##### Create the temporary instance for current `Component`

```tsx
function SampleComponent() {
  const model = useStatedBean(() => new UserModel());

  // pass the model to its children
  return <ChildComponent model={model} />;
}
```

##### The `UseStatedBeanOption`

```ts
option = {
  name: string | symbol;   // get/create the instance with special name
  dependentFields: Array<string | symbol>;   // do re-render when the special property changed
};
```

### Provider

#### `<StatedBeanProvider {...props: StatedBeanProviderProps} />`

The `StatedBeanProvider` is responsible for creating an instance of the stated bean and dispatching an event after data changes.

**StatedBeanProviderProps**

```ts
interface StatedBeanProviderProps {
  types?: ClassType[];
  beanProvider?: BeanProvider;
  application?: StatedBeanApplication;
}
```

## License

[MIT](http://opensource.org/licenses/MIT)
