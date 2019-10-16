import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { App } from './src/App';
import { TodoService } from './src/services/TodoService';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BeanDefinition,
  IBeanFactory,
  StatedBeanApplication,
} from 'stated-bean';

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

ReactDOM.render(<App />, document.getElementById('root'));
