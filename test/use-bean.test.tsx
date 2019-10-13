import { renderHook } from '@testing-library/react-hooks';

import {
  Stated,
  StatedBean,
  useBean,
  StatedBeanProvider,
  useInject,
} from '../src';

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

  it('useBean and inject', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        const bean = useBean(StatedBeanSample, 'namedBean');
        const bean2 = useInject({ name: 'namedBean' });

        return { bean, bean2 };
      },
      { wrapper },
    );
    expect(result.current.bean).not.toBeNull();
    expect(result.current.bean2).not.toBeNull();
    expect(result.current.bean).toBe(result.current.bean2);
  });
});
