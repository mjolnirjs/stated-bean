import { renderHook } from '@testing-library/react-hooks';

import { useInject, StatedBean, StatedBeanProvider } from '../src';

import React from 'react';

@StatedBean()
class SampleStatedBean {
  name = '';
}

describe('useInject test', () => {
  it('useInject get bean from context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        {children}
      </StatedBeanProvider>
    );
    const { result, unmount } = renderHook(
      () => {
        return useInject(SampleStatedBean);
      },
      { wrapper },
    );

    expect(result.current).not.toBeNull();

    unmount();
  });

  it('useInject get fail when without context', () => {
    renderHook(() => {
      expect(() => {
        useInject(SampleStatedBean);
      }).toThrow();
    });
  });

  it('useInject get fail when bean not provided', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[]}>{children}</StatedBeanProvider>
    );

    renderHook(
      () => {
        expect(() => {
          useInject(SampleStatedBean);
        }).toThrow();
      },
      { wrapper },
    );
  });
});
