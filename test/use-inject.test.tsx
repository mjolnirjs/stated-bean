import { renderHook, act } from '@testing-library/react-hooks';

import { useInject, StatedBean, StatedBeanProvider, Stated } from '../src';

import React from 'react';

@StatedBean()
class SampleStatedBean {
  @Stated()
  test = 0;

  changeName() {
    this.test = 1;
  }
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

  it('useInject with name and observe spec fields', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        {children}
      </StatedBeanProvider>
    );
    const { result, unmount } = renderHook(
      () => {
        return useInject({
          type: SampleStatedBean,
          observedFields: ['test'],
        });
      },
      { wrapper },
    );

    expect(result.current).not.toBeNull();
    act(() => {
      result.current.changeName();
    });
    expect(result.current.test).toBe(1);
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
