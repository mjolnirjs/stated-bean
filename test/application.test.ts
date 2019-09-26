import {
  StatedBeanApplication,
  IBeanFactory,
  NextCaller,
  StatedBean,
  Stated,
  StatedBeanContainer,
  EffectEvent,
  StateChanged,
} from '../src';

@StatedBean()
class SampleStatedBean {
  @Stated()
  statedField = 0;

  @Stated()
  statedField2 = 'testStatedField';

  addStatedField = () => {
    this.statedField += 1;
  };
}

describe('StatedBeanApplication', () => {
  it('application bean factory test', () => {
    const application = new StatedBeanApplication();

    class CustomBeanFactory implements IBeanFactory {
      get<T>(): T | undefined {
        return undefined;
      }

      register() {
        //
      }

      remove() {
        //
      }
    }

    const beanFactory = new CustomBeanFactory();
    application.setBeanFactory(beanFactory);

    expect(application.getBeanFactory() === beanFactory).toEqual(true);
  });

  it('application interceptor test', () => {
    const CustomMiddleware = async (
      event: EffectEvent<SampleStatedBean, StateChanged<number>>,
      next: NextCaller,
    ) => {
      expect(event.value.newValue).toEqual(1);
      await next();
    };

    const application = new StatedBeanApplication();

    application.use(CustomMiddleware);

    const container = new StatedBeanContainer(undefined, application);

    container.register({ type: SampleStatedBean });

    const bean = container.getBean(SampleStatedBean);

    if (bean) {
      bean.statedField = 1;
    }
  });
});
