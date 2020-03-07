import { ReflectiveInjector } from 'injection-js';
import React from 'react';

import { CounterSpeed } from './components/Counter';
import { TodoApp } from './components/Todo';
import { TodoService } from './services/TodoService';

import { StatedBeanApplication, StatedBeanProvider, IBeanFactory, BeanDefinition } from 'stated-bean';

const app = new StatedBeanApplication();

class InjectionFactory implements IBeanFactory {
  rootInjector = ReflectiveInjector.resolveAndCreate([TodoService]);

  createBean<T>(beanDefinition: BeanDefinition<T>) {
    let provide;
    let provider;

    if (beanDefinition.isFactoryBean) {
      provide = beanDefinition.factoryBeanType;
      provider = { provide: provide, useFactory: beanDefinition.getFactory()! };
    } else {
      provide = beanDefinition.beanType;
      provider = { provide: provide, useClass: beanDefinition.beanType };
    }
    const injector = ReflectiveInjector.resolveAndCreate([provider], this.rootInjector);

    return injector.get(provide);
  }

  destroyBean<T>(beanDefinition: BeanDefinition<T>) {
    console.info('destroyed', beanDefinition);
  }
}

app.setBeanFactory(new InjectionFactory());

export const DevApp = () => {
  return (
    <StatedBeanProvider application={app}>
      <CounterSpeed />

      <TodoApp />
    </StatedBeanProvider>
  );
};
