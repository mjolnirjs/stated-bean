import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';
import { TodoService } from './src/services/TodoService';

import {
  BeanProvider,
  IBeanFactory,
  StatedBeanApplication,
  StatedBeanProvider,
} from 'stated-bean';
import ReactDOM from 'react-dom';
import React from 'react';

const app = new StatedBeanApplication();

class InjectionFactory implements IBeanFactory {
  rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

  injectors = new Map<string, ReflectiveInjector>();

  get<T>({ type, identity, bean }: BeanProvider<T>) {
    const provide = String(identity || type.name);

    let provider;
    if (bean) {
      provider = { provide: provide, useValue: bean };
    } else {
      provider = { provide: provide, useClass: type };
    }
    const injector = ReflectiveInjector.resolveAndCreate(
      [provider],
      this.rootInjector,
    );

    this.injectors.set(provide, injector);
    return injector.get(provide);
  }

  remove<T>({ type, identity }: BeanProvider<T>) {
    const provide = String(identity || type.name);
    this.injectors.delete(provide);
  }
}

app.setBeanFactory(new InjectionFactory());

const App = () => {
  return (
    <div>
      <StatedBeanProvider application={app} providers={[TodoModel]}>
        <Counter />
        <hr />
        <StatedBeanProvider>
          <Counter />
        </StatedBeanProvider>
        <hr />
        <TodoApp />
      </StatedBeanProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
