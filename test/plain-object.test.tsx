import React from 'react';

import { StatedBeanProvider, useBean } from '../src';

import { renderHook, act } from '@testing-library/react-hooks';

const PlanObjectBean = {
  count: 0,
  add() {
    this.count++;
  },
};

describe('props observer test', () => {
  it('Props init value test', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider>{children}</StatedBeanProvider>
    );

    const { result } = renderHook(
      () => {
        return useBean(() => PlanObjectBean);
      },
      { wrapper },
    );
    expect(result.current.count).toBe(0);
    act(() => {
      result.current.add();
    });
    expect(result.current.count).toBe(1);
  });
});
