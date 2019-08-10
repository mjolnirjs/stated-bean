import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StatedBeanProvider } from '../src';
import { CounterController } from './src/controllers/CounterController';
import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoController } from './src/controllers/TodoController';

const App = () => {
  return (
    <StatedBeanProvider types={[CounterController, TodoController]}>
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
