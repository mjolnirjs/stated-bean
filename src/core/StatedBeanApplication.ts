import { DefaultBeanFactory, IBeanFactory } from './StatedBeanFactory';

/**
 *
 * @export
 * @class StatedBeanApplication
 */
export class StatedBeanApplication {
  private _beanFactory: IBeanFactory = new DefaultBeanFactory();

  getBeanFactory(): IBeanFactory {
    return this._beanFactory;
  }

  setBeanFactory(beanFactory: IBeanFactory) {
    this._beanFactory = beanFactory;
    return this;
  }
}
