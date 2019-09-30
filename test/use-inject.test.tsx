import { renderHook } from '@testing-library/react-hooks';

import { useInject, StatedBean, StatedBeanProvider, Stated } from '../src';

import React from 'react';

@StatedBean()
class SampleStatedBean {
  @Stated()
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

  it('useInject with name and observe spec fields', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        {children}
      </StatedBeanProvider>
    );
    const { result, waitForNextUpdate, unmount } = renderHook(
      () => {
        return useInject(SampleStatedBean, {
          name: 'SampleStatedBean',
          fields: ['name'],
        });
      },
      { wrapper },
    );

    expect(result.current).not.toBeNull();
    result.current.name = '2';
    waitForNextUpdate();
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
