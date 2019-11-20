import { StateAction } from '../types';

import { CountableSubject } from './CountableSubject';
import { StatedBeanContainer } from './StatedBeanContainer';

export class BeanWrapper<T> {
  state$: CountableSubject<StateAction<T>> = new CountableSubject();

  constructor(
    private readonly _container: StatedBeanContainer,
    private readonly _beanName: string | symbol
  ) {
    // this.state$.subscribeCount(count => {
    //   console.log('bean wrapper sub count', count);
    //   if (count === 0) {
    //     this.state$.complete();
    //   }
    // });
  }

  get beanObserver() {
    return this._container.getNamedObserver<T>(this._beanName);
  }

  get beanDefinition() {
    return this.beanObserver!.beanDefinition;
  }

  get beanMeta() {
    return this.beanDefinition.beanMeta;
  }

  forceUpdate(field: keyof T & string) {
    const fieldMeta = (this.beanMeta.statedFields || []).find(
      f => f.name === field
    );
    if (fieldMeta !== undefined) {
      this.beanObserver!.publishStateAction(
        fieldMeta,
        this.beanObserver!.proxy[field]
      );
    }
  }
}
