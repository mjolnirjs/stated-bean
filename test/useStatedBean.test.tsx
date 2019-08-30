import { StatedBean, Stated, StatedBeanProvider, useStatedBean } from '../src';

import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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

describe('useStatedBean test', () => {
  it('bean create', () => {
    const Sample = () => {
      const bean = useStatedBean(StatedBeanScopeSample);
      expect(bean).not.toBeNull();

      const bean2 = useStatedBean(() => new StatedBeanScopeSample2());
      expect(bean2).not.toBeNull();

      return <>{bean.test}</>;
    };

    const Sample2 = () => {
      expect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStatedBean(StatedBeanScopeSample);
      }).toThrow();
      return null;
    };

    const App = () => (
      <>
        <StatedBeanProvider types={[StatedBeanScopeSample]}>
          <Sample />
        </StatedBeanProvider>
        <Sample2 />
      </>
    );

    Enzyme.mount(<App />);
  });
});
