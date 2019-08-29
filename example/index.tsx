import '@abraham/reflection';
import { ReflectiveInjector } from 'injection-js';

import {
  StatedBeanProvider,
  StatedBeanApplication,
  IBeanFactory,
  EffectContext,
  StatedInterceptor,
  NextCaller,
} from '../src';

import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';
import { TodoService } from './src/services/TodoService';

import ReactDOM from 'react-dom';
import React from 'react';

const app = new StatedBeanApplication();

const rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

const beanFactory: IBeanFactory = {
  get(type) {
    return ReflectiveInjector.resolveAndCreate([type], rootInjector).get(type);
  },
};

class LoggerInterceptor implements StatedInterceptor {
  async stateInit(context: EffectContext, next: NextCaller) {
    console.log('1. before init', context.toString());
    await next();
    console.log('1. after init', context.toString());
  }

  async stateChange(context: EffectContext, next: NextCaller) {
    console.log('1. before change', context.toString());
    await next();
    console.log('1. after change', context.toString());
  }
}

class LoggerInterceptor2 implements StatedInterceptor {
  async stateInit(context: EffectContext, next: NextCaller) {
    console.log('2. before init', context.toString());
    await next();
    console.log('2. after init', context.toString());
  }

  async stateChange(context: EffectContext, next: NextCaller) {
    console.log('2. before change', context.toString());
    await next();
    console.log('2. after change', context.toString());
  }
}

app.setBeanFactory(beanFactory);
app.setInterceptors(new LoggerInterceptor(), new LoggerInterceptor2());

const App = () => {
  return (
    <StatedBeanProvider application={app} types={[TodoModel]}>
      <Counter />
      <hr />
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
