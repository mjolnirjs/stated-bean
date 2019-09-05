import { MiddlewareMethod } from '../middleware';

import { IBeanFactory, DefaultBeanFactory } from './StatedBeanFactory';
import { EffectEvent } from './EffectEvent';

/**
 *
 * @export
 * @class StatedBeanApplication
 */
export class StatedBeanApplication {
  private _beanFactory: IBeanFactory = new DefaultBeanFactory();

  private readonly _middleware: MiddlewareMethod[] = [];

  getBeanFactory(): IBeanFactory {
    return this._beanFactory;
  }

  setBeanFactory(beanFactory: IBeanFactory) {
    this._beanFactory = beanFactory;
    return this;
  }

  use(middleware: MiddlewareMethod) {
    this._middleware.push(middleware);
    return this;
  }

  invokeMiddleware<Bean, Value>(effect: EffectEvent<Bean, Value>) {
    let index = -1;
    const dispatch = (i: number): Promise<void> => {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      let middleware: MiddlewareMethod | undefined;
      if (i < this._middleware.length) {
        middleware = this._middleware[i];
      }

      if (!middleware) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(middleware(effect, dispatch.bind(this, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return dispatch(0);
  }
}
