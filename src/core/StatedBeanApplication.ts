import { StatedInterceptor } from '../interceptor/StatedInterceptor';
import { ClassType } from '../types';

import { IBeanFactory, DefaultBeanFactory } from './StatedBeanFactory';
import { EffectContext } from './EffectContext';

export class StatedBeanApplication {
  private _beanFactory: IBeanFactory = new DefaultBeanFactory();

  private _interceptors: StatedInterceptor[] = [];

  getBeanFactory(): IBeanFactory {
    return this._beanFactory;
  }

  setBeanFactory(beanFactory: IBeanFactory) {
    this._beanFactory = beanFactory;
    return this;
  }

  getInterceptors() {
    return this._interceptors;
  }

  setInterceptors(...interceptors: StatedInterceptor[]) {
    this._interceptors = [...interceptors];
    return this;
  }

  addInterceptors(
    ...interceptors: Array<StatedInterceptor | ClassType<StatedInterceptor>>
  ) {
    interceptors.forEach(interceptor =>
      this._interceptors.push(
        typeof interceptor === 'function'
          ? this.getBeanFactory().get(interceptor)
          : interceptor,
      ),
    );
    return this;
  }

  interceptStateInit<Bean, Value>(effect: EffectContext<Bean, Value>) {
    return this.invokeInterceptors('stateInit', effect);
  }

  interceptStateChange<Bean, Value>(effect: EffectContext<Bean, Value>) {
    return this.invokeInterceptors('stateChange', effect);
  }

  private invokeInterceptors<Bean, Value>(
    method: keyof StatedInterceptor,
    effect: EffectContext<Bean, Value>,
  ) {
    let index = -1;
    const dispatch = (i: number): Promise<any> => {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      let interceptor: StatedInterceptor | undefined;
      if (i < this._interceptors.length) {
        interceptor = this._interceptors[i];
      }

      const fn = interceptor && interceptor[method];

      if (!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(
          fn.apply(interceptor, [effect, dispatch.bind(this, i + 1)]),
        );
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return dispatch(0);
  }
}
