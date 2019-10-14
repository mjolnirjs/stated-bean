import {
  BeanDefinition,
  IBeanFactory,
  StatedBeanApplication,
  StatedBeanProvider,
  StatedBeanConsumer,
  StatedBeanContextValue,
} from '../src';

import React from 'react';
import ReactDOM from 'react-dom';

describe('StatedBeanApplication', () => {
  it('application bean factory test', () => {
    const application = new StatedBeanApplication();

    class CustomBeanFactory implements IBeanFactory {
      createBean<T>(beanDefinition: BeanDefinition<T>): T {
        // eslint-disable-next-line new-cap
        return new beanDefinition.beanType();
      }

      destroyBean() {
        //
      }
    }

    const beanFactory = new CustomBeanFactory();
    application.setBeanFactory(beanFactory);

    expect(application.getBeanFactory() === beanFactory).toEqual(true);
  });

  it('StatedBeanConsumer test', () => {
    const application = new StatedBeanApplication();
    const Sample = () => (
      <StatedBeanConsumer>
        {(context: StatedBeanContextValue) => {
          expect(context).not.toBeNull();
          expect(context.container).not.toBeNull();
          expect(context.container!.application).toBe(application);
          return null;
        }}
      </StatedBeanConsumer>
    );

    const App = () => (
      <StatedBeanProvider application={application}>
        <Sample />
      </StatedBeanProvider>
    );

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
