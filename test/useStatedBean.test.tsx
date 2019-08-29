import { StatedBean, Stated, StatedBeanProvider, useStatedBean } from '../src';
import { getMetadataStorage } from '../src/metadata';

import React from 'react';
import ReactDOM from 'react-dom';

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
  beforeAll(() => getMetadataStorage().clear());

  it('DEFAULT scope', () => {
    const Sample = () => {
      // expect(() => {
      //   // eslint-disable-next-line react-hooks/rules-of-hooks
      //   useStatedBean(StatedBeanScopeSample);
      // }).toThrow();

      const bean2 = useStatedBean(() => new StatedBeanScopeSample2());
      expect(bean2).not.toBeNull();

      return <>{bean2.test}</>;
    };

    const App = () => (
      <>
        <StatedBeanProvider types={[StatedBeanScopeSample]}>
          <Sample />
        </StatedBeanProvider>
        <Sample />
      </>
    );

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
