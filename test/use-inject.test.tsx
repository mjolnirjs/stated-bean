import React from 'react';

import { useInject, StatedBean, StatedBeanProvider, Stated } from '../src';

import { renderHook, act } from '@testing-library/react-hooks';

@StatedBean('SampleStatedBean')
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
      <StatedBeanProvider providers={[SampleStatedBean]}>{children}</StatedBeanProvider>
    );
    const { result, unmount } = renderHook(
      () => {
        return useInject(SampleStatedBean);
      },
      { wrapper }
    );

    expect(result.current).not.toBeNull();

    unmount();
  });

  it('useInject a bean from parent test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>
        <StatedBeanProvider>{children}</StatedBeanProvider>
      </StatedBeanProvider>
    );
    const { result, unmount } = renderHook(
      () => {
        const bean1 = useInject(SampleStatedBean);
        const bean2 = useInject({ name: 'SampleStatedBean' });

        return { bean1, bean2 };
      },
      { wrapper }
    );

    expect(result.current.bean1).not.toBeNull();
    expect(result.current.bean2).not.toBeNull();
    expect(result.current.bean1).toBe(result.current.bean2);
    unmount();
  });

  it('useInject with name and observe spec fields', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[SampleStatedBean]}>{children}</StatedBeanProvider>
    );
    const { result, unmount } = renderHook(
      () => {
        return useInject({
          type: SampleStatedBean,
          observedFields: ['test'],
        });
      },
      { wrapper }
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
    const wrapper = ({ children }: { children: React.ReactNode }) => <StatedBeanProvider providers={[]}>{children}</StatedBeanProvider>;

    renderHook(
      // eslint-disable-next-line sonarjs/no-identical-functions
      () => {
        expect(() => {
          useInject(SampleStatedBean);
        }).toThrow();
      },
      { wrapper }
    );
  });
});
