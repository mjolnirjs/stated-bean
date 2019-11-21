import { BehaviorSubject } from 'rxjs';
import React from 'react';

import { Stated, StatedBean, StatedBeanProvider, useBean, useObservable } from '../src';

import { renderHook, act } from '@testing-library/react-hooks';

@StatedBean()
class StatedBeanSample {
  @Stated()
  test$: BehaviorSubject<number> | undefined = undefined;

  init() {
    this.test$ = new BehaviorSubject(0);
  }

  add() {
    if (this.test$) {
      this.test$.next(1);
    }
  }
}

describe('use observable test', () => {
  it('observable state field test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <StatedBeanProvider>{children}</StatedBeanProvider>;

    const { result, unmount } = renderHook(
      () => {
        const model = useBean(StatedBeanSample);
        const value = useObservable(model.test$);

        return { model, value };
      },
      { wrapper }
    );

    expect(result.current.value).toBe(null);
    act(() => {
      result.current.model.init();
    });
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.model.add();
    });
    expect(result.current.value).toBe(1);
    unmount();
  });
});
