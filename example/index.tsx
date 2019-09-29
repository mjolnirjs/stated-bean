import 'reflect-metadata';

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
  ClassType,
  BeanProvider,
} from 'stated-bean';
import React from 'react';
import ReactDOM from 'react-dom';

const app = new StatedBeanApplication();

class InjectionFactory implements IBeanFactory {
  rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

  injectors = new Map<string, ReflectiveInjector>();

  get<T>(type: ClassType<T>, identity?: string | symbol): T | undefined {
    const provide = String(identity || type.name);

    const injector = this.injectors.get(provide);
    if (injector !== undefined) {
      return injector.get(provide);
    }
    return undefined;
  }

  register<T>({ type, identity, bean }: BeanProvider<T>) {
    const provide = String(identity || type.name);
    console.log('register', provide);

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
  }

  remove<T>(type: ClassType<T>, identity?: string | symbol) {
    const provide = String(identity || type.name);
    this.injectors.delete(provide);
  }
}

app.setBeanFactory(new InjectionFactory());
app.use(async (event: EffectEvent, next: NextCaller) => {
  console.log('1. before change', event.type, event.name);
  await next();
  console.log('1. after change', event.type, event.name);
});

const App = () => {
  const [destroy, setDestroyed] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setDestroyed(true);
        }}
      >
        Destroy All
      </button>
      {!destroy && (
        <StatedBeanProvider application={app} providers={[TodoModel]}>
          <Counter />
          <hr />
          <Counter />
          <hr />
          <TodoApp />
        </StatedBeanProvider>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
