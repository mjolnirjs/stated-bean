import { act, renderHook } from '@testing-library/react-hooks';

import {
  Stated,
  StatedBean,
  StatedBeanConsumer,
  StatedBeanContextValue,
  StatedBeanProvider,
  useInject,
} from '../src';

import React from 'react';
import ReactDOM from 'react-dom';
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
      <StatedBeanProvider types={[SampleStatedBean]}>
        <Sample />
        <StatedBeanProvider types={[SampleStatedBean]}>
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
      <StatedBeanProvider types={[SampleStatedBean]}>
        {children}
      </StatedBeanProvider>
    );
    const { result } = renderHook(
      () => {
        return useInject(SampleStatedBean);
      },
      { wrapper },
    );

    act(() => {
      result.current.addStatedField();
    });
    expect(result.current.statedField).toEqual(1);
  });

  it('StatedBeanConsumer', () => {
    const Sample = () => (
      <StatedBeanConsumer>
        {(context: StatedBeanContextValue) => {
          expect(context).not.toBeNull();
          expect(context.container).not.toBeNull();
          return null;
        }}
      </StatedBeanConsumer>
    );

    const App = () => (
      <StatedBeanProvider types={[SampleStatedBean]}>
        <Sample />
      </StatedBeanProvider>
    );

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
