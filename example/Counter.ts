import { StatedBean, Stated } from '../src';

@StatedBean()
export class Counter {

  @Stated()
  public count: number = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
