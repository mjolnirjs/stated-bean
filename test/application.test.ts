import { IBeanFactory, StatedBeanApplication, BeanProvider } from '../src';

describe('StatedBeanApplication', () => {
  it('application bean factory test', () => {
    const application = new StatedBeanApplication();

    class CustomBeanFactory implements IBeanFactory {
      get<T>({ type }: BeanProvider<T>): T {
        // eslint-disable-next-line new-cap
        return new type();
      }

      remove() {
        //
      }
    }

    const beanFactory = new CustomBeanFactory();
    application.setBeanFactory(beanFactory);

    expect(application.getBeanFactory() === beanFactory).toEqual(true);
  });
});
