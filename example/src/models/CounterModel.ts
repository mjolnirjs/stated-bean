import { Injectable } from 'injection-js';

import { StatedBean, Stated } from 'stated-bean';

@StatedBean()
@Injectable()
export class CounterModel {
  @Stated()
  count = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
