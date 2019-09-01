import {
  Stated,
  StatedBean,
  StatedBeanConsumer,
  StatedBeanContextValue,
  StatedBeanProvider,
  useInject,
} from '../src';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

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
  const TestStatedBean = SampleStatedBean;

  // beforeAll(() => getMetadataStorage().clear());

  it('StatedBeanProvider', () => {
    const Sample = () => {
      const bean = useInject(TestStatedBean);

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
      <StatedBeanProvider types={[TestStatedBean]}>
        <Sample />
        <StatedBeanProvider types={[TestStatedBean]}>
          <Sample />
        </StatedBeanProvider>
      </StatedBeanProvider>
    );

    const app = renderer.create(<App />);
    const tree = app.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('useInject and change the stated field', () => {
    const Sample = () => {
      const bean = useInject(TestStatedBean);
      return (
        <>
          <span className="field">field={bean.statedField}</span>
          <button onClick={bean.addStatedField}>add</button>
        </>
      );
    };

    const App = () => (
      <StatedBeanProvider types={[TestStatedBean]}>
        <Sample />
      </StatedBeanProvider>
    );

    const app = Enzyme.mount(<App />);

    expect(app.find('.field').text()).toBe('field=0');

    app.find('button').simulate('click');

    setTimeout(() => expect(app.find('.field').text()).toBe('field=1'), 100);
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
      <StatedBeanProvider types={[TestStatedBean]}>
        <Sample />
      </StatedBeanProvider>
    );

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
