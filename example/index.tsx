import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Container } from 'inversify';
import 'reflect-metadata';

import {
  StatedBeanProvider,
  IFactory,
  ClassType,
  StatedBeanContainer,
} from '../src';
import { CounterModel } from './src/models/CounterModel';
import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';

const container = new Container({ autoBindInjectable: true });

const inversifyBeanFactory = {
  get: (type: ClassType) => {
    return container.get(type);
  },
} as IFactory;

StatedBeanContainer.DEFAULT_BEAN_FACTORY = inversifyBeanFactory;

const App = () => {
  return (
    <StatedBeanProvider types={[CounterModel, TodoModel]}>
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
