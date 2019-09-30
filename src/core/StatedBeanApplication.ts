import { DefaultBeanFactory, IBeanFactory } from './StatedBeanFactory';

/**
 *
 * @export
 * @class StatedBeanApplication
 */
export class StatedBeanApplication {
  private _beanFactory: IBeanFactory = new DefaultBeanFactory();

  private _debug = false;

  getBeanFactory(): IBeanFactory {
    return this._beanFactory;
  }

  setBeanFactory(beanFactory: IBeanFactory) {
    this._beanFactory = beanFactory;
    return this;
  }

  setDebug(_debug: boolean) {
    this._debug = _debug;
  }

  isDebug() {
    return this._debug;
  }
}
