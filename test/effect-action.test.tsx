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
        return { bean, action };
      },
      { wrapper },
    );
    expect(result.current.action.loading).toBe(false);
    const addPromise = act(() => result.current.bean.add());
    expect(result.current.action.loading).toBe(true);
    await addPromise;
    expect(result.current.action.loading).toBe(false);

    unmount();
  });
});
