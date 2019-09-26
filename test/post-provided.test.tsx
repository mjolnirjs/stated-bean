import { renderHook } from '@testing-library/react-hooks';

import {
  PostProvided,
  Stated,
  StatedBean,
  useBean,
  StatedBeanProvider,
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

describe('PostProvided', () => {
  it('PostProvided method invoke', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatedBeanProvider providers={[PostProvidedSample]}>
        {children}
      </StatedBeanProvider>
    );

    const { result, waitForNextUpdate } = renderHook(
      () => {
        return useBean(() => new PostProvidedSample());
      },
      { wrapper },
    );
    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
  });
});
