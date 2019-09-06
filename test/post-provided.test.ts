import { renderHook } from '@testing-library/react-hooks';

import { PostProvided, Stated, StatedBean, useBean } from '../src';

import { delay } from './utils';

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
    const { result, waitForNextUpdate } = renderHook(() => {
      return useBean(() => new PostProvidedSample());
    });
    await waitForNextUpdate();
    expect(result.current.test).toEqual(1);
  });
});
