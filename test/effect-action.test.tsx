import { act, renderHook } from '@testing-library/react-hooks';

import {
  Effect,
  Stated,
  StatedBean,
  useBean,
  useObserveEffect,
  StatedBeanProvider,
} from '../src';

import { delay } from './utils';

import React from 'react';

@StatedBean()
class PostProvidedSample {
  @Stated()
  test = 0;

  @Effect('add')
  async add() {
    await delay(100);
    this.test += 1;
  }

  @Effect()
  add2() {
    this.test = 3;
  }

  @Effect()
  add3() {
    return Promise.reject(new Error());
  }
}

describe('effect action', () => {
  it('effect action change', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[PostProvidedSample]}>
        {children}
      </StatedBeanProvider>
    );

    const { result, unmount } = renderHook(
      () => {
        const bean = useBean(() => new PostProvidedSample());
        const action = useObserveEffect(bean, 'add');
        const action3 = useObserveEffect(bean, 'add3');
        return { bean, action, action3 };
      },
      { wrapper },
    );
    expect(result.current.action.loading).toBe(false);
    const addPromise = act(() => result.current.bean.add());
    expect(result.current.action.loading).toBe(true);
    await addPromise;
    expect(result.current.action.loading).toBe(false);

    await act(() => result.current.bean.add3().catch(() => {}));
    expect(result.current.action3.error).not.toBeNull();

    unmount();
  });

  it('useObserveEffect without provider container', () => {
    renderHook(() => {
      expect(() => {
        useObserveEffect({ test: () => {} }, 'test');
      }).toThrow();
    });
  });
});
