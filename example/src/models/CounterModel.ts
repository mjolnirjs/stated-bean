import { StatedBean, Stated } from 'stated-bean';
import { Injectable } from 'injection-js';

@StatedBean()
@Injectable()
export class CounterModel {
  @Stated()
  count: number = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
