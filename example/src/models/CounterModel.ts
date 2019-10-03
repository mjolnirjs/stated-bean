import { StatedBean, PostProvided, Stated } from 'stated-bean';

@StatedBean()
export class CounterModel {
  @Stated()
  count = 0;

  decrement() {
    this.count--;
  }

  increment() {
    this.count++;
  }

  @PostProvided()
  init() {
    this.count = 10;
  }
}
