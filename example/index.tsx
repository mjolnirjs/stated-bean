import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Container } from 'inversify';
import 'reflect-metadata';

import { StatedBeanProvider, IFactory, ClassType } from '../src';
import { CounterModel } from './src/models/CounterModel';
import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';

const container = new Container({ autoBindInjectable: true });

const InversifyBeanFactory = {
  get: (type: ClassType) => {
    return container.get(type);
  },
} as IFactory;

const App = () => {
  return (
    <StatedBeanProvider
      types={[CounterModel, TodoModel]}
      beanFactory={InversifyBeanFactory}
    >
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
