import {
  StatedBean,
  Stated,
  StatedBeanConsumer,
  StatedBeanProvider,
  useStatedBean,
  StatedBeanContextValue,
} from '../src';

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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

describe('react provider', () => {
  const TestStatedBean = SampleStatedBean;

  // beforeAll(() => getMetadataStorage().clear());

  it('StatedBeanProvider', () => {
    const Sample = () => {
      const bean = useStatedBean(TestStatedBean);

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

  it('useStatedBean and change the stated field', () => {
    const Sample = () => {
      const bean = useStatedBean(TestStatedBean);
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

    setTimeout(() => expect(app.find('.field').text()).toBe('field=1'), 200);
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
