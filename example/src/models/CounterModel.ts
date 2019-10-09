import { BehaviorSubject } from 'rxjs';

import { ObservableProps, PostProvided, Stated, StatedBean } from 'stated-bean';

@StatedBean()
export class CounterModel {
  @ObservableProps()
  value$!: BehaviorSubject<number>;

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
    this.value$.subscribe(value => {
      this.count = value;
    });
  }
}
