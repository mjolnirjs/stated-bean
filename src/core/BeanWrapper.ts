import { StateAction } from '../types';

import { BeanObserver } from './BeanObserver';
import { CountableSubject } from './CountableSubject';

export class BeanWrapper<T> {
  state$: CountableSubject<StateAction<T>> = new CountableSubject();

  constructor(private readonly _beanObserver: BeanObserver<T>) {
    // this.state$.subscribeCount(count => {
    //   console.log('bean wrapper sub count', count);
    //   if (count === 0) {
    //     this.state$.complete();
    //   }
    // });
  }

  get beanObserver() {
    return this._beanObserver;
  }

  get beanDefinition() {
    return this.beanObserver.beanDefinition;
  }

  get beanMeta() {
    return this.beanDefinition.beanMeta;
  }

  forceUpdate(field: keyof T & string) {
    const fieldMeta = (this.beanMeta.statedFields || []).find(
      f => f.name === field,
    );
    if (fieldMeta !== undefined) {
      this.beanObserver.publishStateAction(
        fieldMeta,
        this.beanObserver.proxy[field],
      );
    }
  }
}
