import {
  StatedInterceptor,
  InterceptMethod,
} from '../interceptor/StatedInterceptor';
import { ClassType } from '../types';

import { IBeanFactory, DefaultBeanFactory } from './StatedBeanFactory';
import { EffectContext } from './EffectContext';

export class StatedBeanApplication {
  private _beanFactory: IBeanFactory;

  private _interceptors: StatedInterceptor[] = [];

  constructor() {
    this._beanFactory = new DefaultBeanFactory();
  }

  setBeanFactory(beanFactory: IBeanFactory) {
    this._beanFactory = beanFactory;
  }

  getBeanFactory(): IBeanFactory {
    return this._beanFactory;
  }

  setInterceptors(...interceptors: StatedInterceptor[]): void {
    this._interceptors = [...interceptors];
  }

  addInterceptors(
    ...interceptors: Array<StatedInterceptor | ClassType<StatedInterceptor>>
  ): void {
    if (interceptors) {
      interceptors.forEach(interceptor => {
        if (typeof interceptor === 'function') {
          this._interceptors.push(this.getBeanFactory().get(interceptor));
        } else {
          this._interceptors.push(interceptor);
        }
      });
    }
  }

  getInterceptors() {
    return this._interceptors;
  }

  async interceptStateInit(effect: EffectContext): Promise<void> {
    return this.invokeInterceptors('stateInitIntercept', effect);
  }

  async interceptStateChange(effect: EffectContext): Promise<void> {
    return this.invokeInterceptors('stateChangeIntercept', effect);
  }

  private invokeInterceptors(method: string, effect: EffectContext) {
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

      const fn =
        interceptor !== undefined
          ? ((interceptor as any)[method] as InterceptMethod)
          : undefined;

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
