import {
  StatedBeanApplication,
  IBeanFactory,
  ClassType,
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
      get<T>(Type: ClassType<T>) {
        return new Type();
      }
    }

    const beanFactory = new CustomBeanFactory();
    application.setBeanFactory(beanFactory);

    expect(application.getBeanFactory() === beanFactory).toEqual(true);
  });

  it('application interceptor test', async () => {
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

    await container.register(SampleStatedBean);

    const bean = container.getBean(SampleStatedBean);

    if (bean) {
      bean.statedField = 1;
    }
  });
});
