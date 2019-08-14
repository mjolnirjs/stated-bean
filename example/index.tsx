import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Container } from 'inversify';
import 'reflect-metadata';

import {
  StatedBeanProvider,
  ClassType,
  StatedBeanApplication,
  IBeanFactory,
  EffectContext,
} from '../src';
import { CounterModel } from './src/models/CounterModel';
import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';
import {
  StatedInterceptor,
  NextCaller,
} from '../src/interceptor/StatedInterceptor';

const container = new Container({ autoBindInjectable: true });
const app = new StatedBeanApplication();

const inversifyBeanFactory = {
  get: (type: ClassType) => {
    return container.get(type);
  },
} as IBeanFactory;

class LoggerInterceptor implements StatedInterceptor {
  async stateInitIntercept(context: EffectContext, next: NextCaller) {
    console.log('1. before init', context.toString());
    await next();
    console.log('1. after init', context.toString());
  }
  async stateChangeIntercept(context: EffectContext, next: NextCaller) {
    console.log('1. before change', context.toString());
    await next();
    console.log('1. after change', context.toString());
  }
}

class LoggerInterceptor2 implements StatedInterceptor {
  async stateInitIntercept(context: EffectContext, next: NextCaller) {
    console.log('2. before init', context.toString());
    await next();
    console.log('2. after init', context.toString());
  }
  async stateChangeIntercept(context: EffectContext, next: NextCaller) {
    console.log('2. before change', context.toString());
    await next();
    console.log('2. after change', context.toString());
  }
}

app.setBeanFactory(inversifyBeanFactory);
app.setInterceptors(new LoggerInterceptor(), new LoggerInterceptor2());

const App = () => {
  return (
    <StatedBeanProvider app={app} types={[CounterModel, TodoModel]}>
      <Counter />
      <hr />
      <TodoApp />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
