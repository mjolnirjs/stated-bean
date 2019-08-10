import { StatedBean, Stated } from '../../../src';

@StatedBean()
export class CounterController {
  @Stated()
  public count: number = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
