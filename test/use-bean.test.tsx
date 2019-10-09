import { renderHook } from '@testing-library/react-hooks';

import { Stated, StatedBean, useBean, StatedBeanProvider } from '../src';

import React from 'react';

@StatedBean()
class StatedBeanSample {
  @Stated()
  test = 0;
}

describe('useBean test', () => {
  it('useBean get fail when without context', () => {
    renderHook(() => {
      expect(() => {
        useBean(StatedBeanSample);
      }).toThrow();
    });
  });

  it('bean create', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        return useBean(StatedBeanSample);
      },
      { wrapper },
    );
    expect(result.current).not.toBeNull();
  });
});
