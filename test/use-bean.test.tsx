import { Stated, StatedBean, useBean } from '../src';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });

@StatedBean()
class StatedBeanScopeSample {
  @Stated()
  test = 0;
}

@StatedBean()
class StatedBeanScopeSample2 {
  @Stated()
  test = 0;
}

describe('useBean test', () => {
  it('bean create', () => {
    const Sample = () => {
      const bean = useBean(StatedBeanScopeSample);
      expect(bean).not.toBeNull();

      const bean2 = useBean(() => new StatedBeanScopeSample2());
      expect(bean2).not.toBeNull();

      return <>{bean.test}</>;
    };

    const App = () => <Sample />;

    Enzyme.mount(<App />);
  });
});
