import { getMetadataStorage } from '../src/metadata';
import { StatedBean, Stated } from '../src';

describe('metadata', () => {
  let smapleStatedBeanName: string;

  beforeAll(() => {
    getMetadataStorage().clear();

    @StatedBean()
    class SampleStatedBean {
      @Stated()
      public statedField: number;

      @Stated()
      public statedField2: string;

      public constructor() {
        this.statedField = 0;
        this.statedField2 = 'testStatedField';
      }
    }

    smapleStatedBeanName = SampleStatedBean.name;
  });

  it('get metadata storage from window', () => {
    const storage = getMetadataStorage();
    expect(storage).not.toBeNull();
  });

  it('stated bean decorator metadata collected', () => {
    const storage = getMetadataStorage();
    const beanMeta = storage.getBeanMeta(smapleStatedBeanName);

    expect(beanMeta).not.toBeNull();
    expect(beanMeta!.name).toEqual(smapleStatedBeanName);
    expect(beanMeta!.statedFields).not.toBeNull();

    if (beanMeta !== undefined && beanMeta.statedFields !== undefined) {
      const field1 = beanMeta.statedFields[0];
      expect(field1.name).toEqual('statedField');
    }
  });
});
