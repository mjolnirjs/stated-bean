import { renderHook } from '@testing-library/react-hooks';

import { Stated, StatedBean, useBean } from '../src';

@StatedBean()
class StatedBeanSample {
  @Stated()
  test = 0;
}

describe('useBean test', () => {
  it('bean create', () => {
    const { result } = renderHook(() => {
      return useBean(() => new StatedBeanSample());
    });
    expect(result.current).not.toBeNull();
  });
});
