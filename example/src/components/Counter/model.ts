import { InitializingBean, Props, Stated, StatedBean } from 'stated-bean';

@StatedBean({ singleton: false })
export class CounterModel implements InitializingBean {
  @Stated()
  count = 0;

  @Props()
  speed = 1;

  timer?: NodeJS.Timeout;

  afterProvided() {
    this.startTimer(1);
  }

  startTimer(speed: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.count++;
    }, 1000 * (1 / speed));
  }

  setSpeed(speed: number) {
    if (speed > 0) {
      this.startTimer(speed);
    }
  }
}
