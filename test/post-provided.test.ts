import { StatedBean, Stated, PostProvided, StatedBeanContainer } from '../src';

@StatedBean()
class PostProvidedSample {
  @Stated()
  test = 0;

  @PostProvided()
  postMethod() {
    this.test = 1;
  }
}

describe('PostProvided', () => {
  it('PostProvided method invoke', async () => {
    const container = new StatedBeanContainer();
    await container.register(PostProvidedSample);

    const bean = container.getBean(PostProvidedSample);

    if (bean) {
      expect(bean.test).toEqual(1);
    }
  });
});
