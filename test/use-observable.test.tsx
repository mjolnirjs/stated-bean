import { renderHook, act } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';

import {
  Stated,
  StatedBean,
  StatedBeanProvider,
  useBean,
  useObservable,
} from '../src';

import React from 'react';

@StatedBean()
class StatedBeanSample {
  @Stated()
  test$ = new BehaviorSubject(0);

  add() {
    this.test$.next(1);
  }
}

describe('effect action', () => {
  it('bean create', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        const model = useBean(StatedBeanSample);
        const value = useObservable(model.test$);

        return { model, value };
      },
      { wrapper },
    );
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.model.add();
    });
    expect(result.current.value).toBe(1);
  });
});
