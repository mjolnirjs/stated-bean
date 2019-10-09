import { renderHook } from '@testing-library/react-hooks';

import {
  PostProvided,
  Stated,
  StatedBean,
  useBean,
  StatedBeanProvider,
  DisposableBean,
  InitializingBean,
  BeanContainerAware,
  StatedBeanContainer,
} from '../src';

import { delay } from './utils';

import React from 'react';

@StatedBean()
class PostProvidedSample {
  @Stated()
  test = 0;

  @PostProvided()
  async postMethod() {
    await delay(100);
    this.test = 1;
  }
}

@StatedBean()
class LifeCycleBean
  implements DisposableBean, InitializingBean, BeanContainerAware {
  @Stated()
  test = 0;

  container: StatedBeanContainer | null = null;

  destroy(): void {
    this.test = 0;
  }

  postProvided() {
    this.test = 1;
  }

  setBeanContainer(container: StatedBeanContainer) {
    this.container = container;
  }
}

describe('LifeCycle', () => {
  it('PostProvided method hook', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result, waitForNextUpdate, unmount } = renderHook(
      () => {
        return useBean(PostProvidedSample);
      },
      { wrapper },
    );
    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
    unmount();
  });

  it('Bean life-cycle hooks', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result, waitForNextUpdate, unmount } = renderHook(
      () => {
        return useBean(() => new LifeCycleBean());
      },
      { wrapper },
    );
    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
    expect(result.current.container).not.toBeNull();
    unmount();

    expect(result.current.test).toEqual(0);
  });
});
