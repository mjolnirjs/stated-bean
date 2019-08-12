import { StatedBean, Stated } from '../../../src';
import { injectable } from 'inversify';

@injectable()
@StatedBean()
export class CounterModel {
  @Stated()
  public count: number = 0;

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}
