import { renderHook } from '@testing-library/react-hooks';

import {
  Stated,
  StatedBean,
  useBean,
  StatedBeanProvider,
  useInject,
} from '../src';

import React from 'react';

const SymbolNamedBean = Symbol('stated-bean');

@StatedBean()
class StatedBeanSample {
  @Stated()
  test = 0;
}

@StatedBean({ singleton: true })
class SingletonBean {
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

        const bean3 = useBean(StatedBeanSample, SymbolNamedBean);
        const bean4 = useInject({ name: SymbolNamedBean });

        return { bean, bean2, bean3, bean4 };
      },
      { wrapper },
    );
    expect(result.current.bean).not.toBeNull();
    expect(result.current.bean2).not.toBeNull();
    expect(result.current.bean).toBe(result.current.bean2);

    expect(result.current.bean3).not.toBeNull();
    expect(result.current.bean4).not.toBeNull();
    expect(result.current.bean3).toBe(result.current.bean4);
  });

  it('singleton bean test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        const bean = useBean(SingletonBean);
        const bean2 = useBean(SingletonBean);
        const bean3 = useBean(SingletonBean, { name: 'anotherName' });
        return { bean, bean2, bean3 };
      },
      { wrapper },
    );

    expect(result.current.bean).not.toBeNull();
    expect(result.current.bean2).not.toBeNull();
    expect(result.current.bean).toBe(result.current.bean2);

    expect(result.current.bean3).not.toBeNull();
    expect(result.current.bean3).not.toBe(result.current.bean);
  });
});
