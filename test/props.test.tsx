import { BehaviorSubject } from 'rxjs';
import React from 'react';

import { ObservableProps, Props, Stated, StatedBean, StatedBeanProvider, useBean } from '../src';

import { renderHook } from '@testing-library/react-hooks';

@StatedBean()
class StatedBeanSample {
  @Props('value')
  value3 = 0;

  @Stated()
  value4 = 0;

  @ObservableProps()
  value$!: BehaviorSubject<number>;

  @ObservableProps('value')
  value2$!: BehaviorSubject<number>;

  @ObservableProps()
  value!: BehaviorSubject<number>;

  setValue3(v: number) {
    this.value4 = v;
  }
}

describe('props observer test', () => {
  it('Props init value test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <StatedBeanProvider>{children}</StatedBeanProvider>;

    const { result, rerender } = renderHook(
      props => {
        return useBean(StatedBeanSample, { props });
      },
      { wrapper, initialProps: { value: 10 } }
    );

    expect(result.current.value3).toBe(10);
    expect(result.current.value.getValue()).toBe(10);
    expect(result.current.value$.getValue()).toBe(10);
    expect(result.current.value2$.getValue()).toBe(10);

    rerender({ value: 20 });

    expect(result.current.value3).toBe(10);
    expect(result.current.value4).toBe(20);
    expect(result.current.value.getValue()).toBe(20);
    expect(result.current.value$.getValue()).toBe(20);
    expect(result.current.value2$.getValue()).toBe(20);
  });
});
