import { BeanDefinition, IBeanFactory, StatedBeanApplication } from '../src';

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
});
