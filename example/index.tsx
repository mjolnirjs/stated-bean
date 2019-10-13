import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { Counter } from './src/components/Counter';
import { TodoApp } from './src/components/Todo';
import { TodoModel } from './src/models/TodoModel';
import { TodoService } from './src/services/TodoService';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BeanDefinition,
  IBeanFactory,
  StatedBeanApplication,
  StatedBeanProvider,
} from 'stated-bean';

const app = new StatedBeanApplication();

class InjectionFactory implements IBeanFactory {
  rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

  createBean<T>(beanDefinition: BeanDefinition<T>) {
    let provide;
    let provider;
    if (beanDefinition.isFactoryBean) {
      provide = beanDefinition.getFactoryBeanType();
      provider = { provide: provide, useFactory: beanDefinition.getFactory()! };
    } else {
      provide = beanDefinition.beanType;
      provider = { provide: provide, useClass: beanDefinition.beanType };
    }
    const injector = ReflectiveInjector.resolveAndCreate(
      [provider],
      this.rootInjector,
    );

    return injector.get(provide);
  }

  destroyBean<T>(beanDefinition: BeanDefinition<T>) {
    console.info('destroyed', beanDefinition);
  }
}

app.setBeanFactory(new InjectionFactory());

const App = () => {
  const [counter, setCounter] = React.useState(5);
  return (
    <div>
      <StatedBeanProvider application={app} providers={[TodoModel]}>
        <button
          onClick={() => {
            setCounter(counter + 1);
          }}
        >
          Add
        </button>
        <hr />
        {counter < 20 && <Counter value={counter} />}
        <hr />
        {counter < 10 && <Counter value={counter} />}
        <hr />
        <TodoApp />
      </StatedBeanProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
