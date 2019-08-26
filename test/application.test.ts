import {
  StatedBeanApplication,
  IBeanFactory,
  ClassType,
  StatedInterceptor,
  EffectContext,
  NextCaller,
  StatedBean,
  Stated,
  StatedBeanContainer,
} from '../src';
import { getMetadataStorage } from '../src/metadata';

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
      get(type: ClassType) {
        // eslint-disable-next-line new-cap
        return new type();
      }
    }

    const beanFactory = new CustomBeanFactory();
    application.setBeanFactory(beanFactory);

    expect(application.getBeanFactory() === beanFactory).toEqual(true);
  });

  it('application interceptor test', async () => {
    class CustomInterceptor implements StatedInterceptor {
      async stateInit(context: EffectContext, next: NextCaller) {
        expect(
          context.bean === context.container.getBean(SampleStatedBean),
        ).toEqual(true);
        expect(
          context.beanMeta ===
            getMetadataStorage().getBeanMeta(SampleStatedBean),
        ).toEqual(true);
        expect(
          context.beanMeta.statedFields!.includes(context.fieldMeta),
        ).toEqual(true);
        await next();
      }

      async stateChange(_context: EffectContext, next: NextCaller) {
        await next();
      }
    }

    const application = new StatedBeanApplication();

    application.setInterceptors(new CustomInterceptor());
    application.addInterceptors(CustomInterceptor, new CustomInterceptor());

    expect(application.getInterceptors().length).toEqual(3);
    expect(
      application.getInterceptors()[0] instanceof CustomInterceptor,
    ).toEqual(true);
    expect(
      application.getInterceptors()[1] instanceof CustomInterceptor,
    ).toEqual(true);

    const container = new StatedBeanContainer(undefined, application);

    await container.register(SampleStatedBean);

    const bean = container.getBean(SampleStatedBean);

    if (bean) {
      bean.statedField = 1;
    }
  });
});
