import '@abraham/reflection';

import { ReflectiveInjector } from 'injection-js';

import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';
import { TodoService } from './src/services/TodoService';

import {
  EffectEvent,
  IBeanFactory,
  NextCaller,
  StatedBeanApplication,
  StatedBeanProvider,
  useBean,
} from 'stated-bean';
import ReactDOM from 'react-dom';
import React from 'react';

const app = new StatedBeanApplication();

const rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

const beanFactory: IBeanFactory = {
  get(type) {
    return ReflectiveInjector.resolveAndCreate([type], rootInjector).get(type);
  },
};

app.setBeanFactory(beanFactory);
app.use(async (event: EffectEvent, next: NextCaller) => {
  console.log('1. before change', event.type, event.name);
  await next();
  console.log('1. after change', event.type, event.name);
});

const App = () => {
  const model = useBean(() => beanFactory.get(TodoModel));
  return (
    <StatedBeanProvider application={app} beans={[model]}>
      <Counter />
      <hr />
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
