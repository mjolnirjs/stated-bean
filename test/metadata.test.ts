import { getMetadataStorage } from '../src/metadata';
import { StatedBean, Stated } from '../src';

describe('metadata', () => {
  let sampleStatedBeanName: string;

  beforeAll(() => {
    getMetadataStorage().clear();

    @StatedBean()
    class SampleStatedBean {
      @Stated()
      statedField: number;

      @Stated()
      statedField2: string;

      constructor() {
        this.statedField = 0;
        this.statedField2 = 'testStatedField';
      }
    }

    sampleStatedBeanName = SampleStatedBean.name;
  });

  it('get metadata storage from window', () => {
    const storage = getMetadataStorage();
    expect(storage).not.toBeNull();
  });

  it('stated bean decorator metadata collected', () => {
    const storage = getMetadataStorage();
    const beanMeta = storage.getBeanMeta(sampleStatedBeanName);

    expect(beanMeta).not.toBeNull();
    expect(beanMeta!.name).toEqual(sampleStatedBeanName);
    expect(beanMeta!.statedFields).not.toBeNull();

    if (beanMeta != null && beanMeta.statedFields != null) {
      const field1 = beanMeta.statedFields[0];
      expect(field1.name).toEqual('statedField');
    }
  });
});
