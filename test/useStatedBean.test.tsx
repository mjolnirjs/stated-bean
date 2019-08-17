import {
  StatedBean,
  Stated,
  StatedBeanProvider,
  useStatedBean,
  StatedBeanScope,
} from '../src';
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
      const bean = useStatedBean(StatedBeanScopeSample);

      expect(bean).not.toBeNull();
      expect(bean.test).toEqual(0);

      expect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStatedBean(StatedBeanScopeSample2, {
          scope: StatedBeanScope.CONTEXT,
        });
      }).toThrow();

      const bean2 = useStatedBean(StatedBeanScopeSample2);
      expect(bean2).not.toBeNull();

      const bean3 = useStatedBean(StatedBeanScopeSample2, {
        scope: StatedBeanScope.REQUEST,
      });
      expect(bean3).not.toBeNull();

      return <>{bean.test}</>;
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
