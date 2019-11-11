import { BehaviorSubject } from 'rxjs';
import React from 'react';

import {
  ObservableProps,
  Props,
  Stated,
  StatedBean,
  StatedBeanProvider,
  useBean,
  getBeanWrapper,
} from '../src';

import { renderHook, act } from '@testing-library/react-hooks';

@StatedBean()
class StatedBeanSample {
  @Stated()
  @Props()
  value = 0;

  @ObservableProps()
  value$!: BehaviorSubject<number>;

  @ObservableProps('value')
  value2!: BehaviorSubject<number>;
}

describe('bean wrapper test', () => {
  it('bean wrapper init test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        return useBean(StatedBeanSample);
      },
      { wrapper },
    );
    const bean = result.current;
    const beanWrapper = getBeanWrapper(bean);
    expect(beanWrapper).not.toBeUndefined();
    expect(beanWrapper!.beanDefinition).not.toBeUndefined();
    expect(beanWrapper!.beanMeta).not.toBeUndefined();
    expect(beanWrapper!.beanObserver).not.toBeUndefined();
    expect(beanWrapper!.state$).not.toBeUndefined();
  });

  // eslint-disable-next-line jest/expect-expect
  it('bean wrapper forceUpdate test', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result, waitForNextUpdate } = renderHook(
      () => {
        return useBean(StatedBeanSample);
      },
      { wrapper },
    );

    const bean = result.current;
    const beanWrapper = getBeanWrapper(bean);

    act(() => {
      setTimeout(() => {
        beanWrapper!.forceUpdate('value');
      }, 100);
    });
    await waitForNextUpdate();
  });
});
