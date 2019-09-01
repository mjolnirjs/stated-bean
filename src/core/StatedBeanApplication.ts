import { StatedInterceptor } from '../interceptor/StatedInterceptor';
import { ClassType } from '../types';

import { IBeanFactory, DefaultBeanFactory } from './StatedBeanFactory';
import { EffectContext } from './EffectContext';

/**
 *
 * @export
 * @class StatedBeanApplication
 */
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
    interceptors.forEach(interceptor => {
      if (typeof interceptor === 'function') {
        const interceptorBean = this.getBeanFactory().get(interceptor);
        if (interceptorBean) {
          this._interceptors.push(interceptorBean);
        } else {
          throw new Error(
            `get interceptor[${interceptor.name}] from bean factory fail`,
          );
        }
      } else {
        this._interceptors.push(interceptor);
      }
    });
    return this;
  }

  interceptStateInit<Bean, Value>(effect: EffectContext<Bean, Value>) {
    return this._invokeInterceptors('stateInit', effect);
  }

  interceptStateChange<Bean, Value>(effect: EffectContext<Bean, Value>) {
    return this._invokeInterceptors('stateChange', effect);
  }

  private _invokeInterceptors<Bean, Value>(
    method: keyof StatedInterceptor,
    effect: EffectContext<Bean, Value>,
  ) {
    let index = -1;
    const dispatch = (i: number): Promise<void> => {
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
