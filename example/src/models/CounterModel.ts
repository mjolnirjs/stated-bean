import { Injectable } from 'injection-js';

import { StatedBean, Stated, Effect } from 'stated-bean';

@StatedBean()
@Injectable()
export class CounterModel {
  @Stated()
  count = 0;

  @Effect('11')
  increment() {
    this.count++;
  }

  decrement = () => {
    this.count--;
  };
}
