import { getMetadataStorage } from '../src/metadata';
import {
  StatedBean,
  Stated,
  StatedBeanConsumer,
  StatedBeanProvider,
  useStatedBean,
  StatedBeanContextValue,
} from '../src';
import { ClassType } from '../src/types/ClassType';

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('react provider', () => {
  let TestStatedBean: ClassType;

  class T {
    t!: number;
  }

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

      addStatedField = () => {
        this.statedField += 1;
      };
    }

    TestStatedBean = SampleStatedBean;
  });

  it('StatedBeanProvider', () => {
    const Sample = () => {
      const bean = useStatedBean(TestStatedBean);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      expect(() => useStatedBean(T)).toThrow();

      expect(bean).not.toBeNull();
      expect(bean.statedField).toEqual(0);

      return (
        <div>
          {bean.statedField}{' '}
          <button id="addBtn" onClick={bean.addStatedField}>
            add
          </button>
        </div>
      );
    };

    const App = () => {
      return (
        <StatedBeanProvider types={[TestStatedBean]}>
          <Sample />
          <StatedBeanProvider types={[TestStatedBean]}>
            <Sample />
          </StatedBeanProvider>
        </StatedBeanProvider>
      );
    };

    const app = renderer.create(<App />);
    const tree = app.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('useStatedBean and change the stated field', () => {
    const Sample = () => {
      const bean = useStatedBean(TestStatedBean);
      return (
        <div>
          <span className="field">field={bean.statedField}</span>
          <button onClick={bean.addStatedField}>add</button>
        </div>
      );
    };

    const App = () => {
      return (
        <StatedBeanProvider types={[TestStatedBean]}>
          <Sample />
        </StatedBeanProvider>
      );
    };

    const app = Enzyme.mount(<App />);

    expect(app.html().includes('field=0')).toBe(true);
    const sample = app.find('Sample');
    sample.find('button').simulate('click');
    // FIXME
    expect(app.html().includes('field=1')).toBe(false);
  });

  it('StatedBeanConsumer', () => {
    const Sample = () => {
      return (
        <StatedBeanConsumer>
          {(context: StatedBeanContextValue) => {
            expect(context).not.toBeNull();
            expect(context.container).not.toBeNull();

            return null;
          }}
        </StatedBeanConsumer>
      );
    };

    const App = () => {
      return (
        <StatedBeanProvider types={[TestStatedBean]}>
          <Sample />
        </StatedBeanProvider>
      );
    };

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
