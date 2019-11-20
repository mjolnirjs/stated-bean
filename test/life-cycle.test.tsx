import React from 'react';

import {
  BeanContainerAware,
  DisposableBean,
  InitializingBean,
  AfterProvided,
  Stated,
  StatedBean,
  StatedBeanContainer,
  StatedBeanProvider,
  useBean,
} from '../src';

import { delay } from './utils';

import { renderHook, act } from '@testing-library/react-hooks';

@StatedBean()
class PostProvidedSample {
  @Stated()
  test = 0;

  @AfterProvided()
  async postMethod() {
    await delay(100);
    this.test = 1;
  }
}

@StatedBean()
class LifeCycleBean implements DisposableBean, InitializingBean, BeanContainerAware {
  @Stated()
  test = 0;

  container: StatedBeanContainer | null = null;

  destroy(): void {
    this.test = 0;
  }

  afterProvided() {
    this.test = 1;
  }

  setBeanContainer(container: StatedBeanContainer) {
    this.container = container;
  }
}

describe('LifeCycle', () => {
  it('PostProvided method hook', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <StatedBeanProvider>{children}</StatedBeanProvider>;

    const { result, waitForNextUpdate, unmount } = renderHook(
      () => {
        return useBean(PostProvidedSample);
      },
      { wrapper }
    );

    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
    unmount();
  });

  it('Bean life-cycle hooks', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <StatedBeanProvider>{children}</StatedBeanProvider>;

    const { result, waitForNextUpdate, unmount } = renderHook(
      () => {
        return useBean(LifeCycleBean);
      },
      { wrapper }
    );

    act(() => {});
    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
    expect(result.current.container).not.toBeNull();
    unmount();
    expect(result.current.test).toEqual(0);
  });
});
