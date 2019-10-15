import { Stated, StatedBean, StatedBeanProvider, useInject } from '../src';

import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import renderer from 'react-test-renderer';

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

describe('stated value changed test', () => {
  it('StatedBeanProvider', () => {
    const Sample = () => {
      const bean = useInject(SampleStatedBean);

      expect(bean).not.toBeNull();
      expect(bean.statedField).toEqual(0);

      return (
        <>
          {bean.statedField}
          <button onClick={bean.addStatedField}>add</button>
        </>
      );
    };

    const App = () => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        <Sample />
        <StatedBeanProvider providers={[SampleStatedBean]}>
          <Sample />
        </StatedBeanProvider>
      </StatedBeanProvider>
    );

    const app = renderer.create(<App />);
    const tree = app.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('useInject and change the stated field', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        {children}
      </StatedBeanProvider>
    );
    const { result } = renderHook(
      () => {
        return useInject(SampleStatedBean);
      },
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => result.current.addStatedField());
    expect(result.current.statedField).toEqual(1);
  });
});
