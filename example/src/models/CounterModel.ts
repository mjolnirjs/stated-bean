import { BehaviorSubject } from 'rxjs';

import {
  InitializingBean,
  ObservableProps,
  Stated,
  StatedBean,
} from 'stated-bean';

@StatedBean({ singleton: false })
export class CounterModel implements InitializingBean {
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

  afterProvided() {
    this.value$.subscribe(value => {
      this.count = value;
    });
  }
}
