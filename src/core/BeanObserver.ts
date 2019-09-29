import { Subject } from 'rxjs';

import { getMetadataStorage } from '../metadata';
import {
  EffectAction,
  StateAction,
  StatedBeanMeta,
  StatedFieldMeta,
  StrictBeanProvider,
} from '../types';

import { CountableSubject } from './CountableSubject';
import { NoSuchBeanDefinitionError } from './NoSuchBeanDefinitionError';
import { StatedBeanContainer } from './StatedBeanContainer';
import { StatedBeanSymbol } from './Symbols';
import {
  isDisposableBean,
  isBeanContainerAware,
  isInitializingBean,
} from './LifeCycle';

export class BeanObserver<T> {
  state$: CountableSubject<StateAction<T>> = new CountableSubject();
  effect$: Subject<EffectAction> = new Subject();

  _beanMeta: StatedBeanMeta;

  constructor(
    private readonly _container: StatedBeanContainer,
    private readonly _provider: StrictBeanProvider<T>,
  ) {
    const beanMeta = getMetadataStorage().getBeanMeta(this._provider.type);
    if (beanMeta === undefined) {
      throw new NoSuchBeanDefinitionError(this._provider.type.name);
    }
    this._beanMeta = beanMeta;

    if (isBeanContainerAware(this.bean)) {
      this.bean.setBeanContainer(this._container);
    }
    this._observe();
  }

  get bean(): T {
    return this._provider.bean;
  }

  destroy() {
    this.state$.complete();
    this.effect$.complete();
    if (isDisposableBean(this.bean)) {
      this.bean.destroy();
    }
  }

  publishStateAction(fieldMeta: StatedFieldMeta, value: T[keyof T]) {
    const action: StateAction<T> = {
      bean: this.bean,
      nextValue: value,
      prevValue: this.bean[fieldMeta.name as keyof T],
      fieldMeta,
      beanMeta: this._beanMeta,
    };
    this.state$.next(action);
  }

  private _observe() {
    this._defineStatedBean();

    const fields = this._beanMeta.statedFields || [];
    fields.forEach(field => this._observeBeanField(field));
    if (
      this._beanMeta.postMethod != null &&
      this._beanMeta.postMethod.descriptor !== undefined
    ) {
      const f = this._beanMeta.postMethod.descriptor.value;
      f!.apply(this.bean);
    } else if (isInitializingBean(this.bean)) {
      this.bean.postProvided();
    }
  }

  // @internal
  private _defineStatedBean() {
    const self = this;
    Object.defineProperty(this.bean, StatedBeanSymbol, {
      value: {
        name: self._provider.identity,
        container: self._container,
        forceUpdate: function(field: keyof T & string) {
          const fieldMeta = (self._beanMeta.statedFields || []).find(
            f => f.name === field,
          );
          if (fieldMeta === undefined) {
            return;
          }
          self.publishStateAction(fieldMeta, self.bean[field]);
        },
      },
    });
  }

  // @internal
  private _observeBeanField(fieldMeta: StatedFieldMeta) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v') as keyof T;

    Object.defineProperty(this.bean, proxyField, {
      writable: true,
      value: this.bean[fieldMeta.name as keyof T],
    });

    const self = this;
    Object.defineProperty(this.bean, fieldMeta.name.toString(), {
      set(value: T[keyof T]) {
        self.bean[proxyField] = value;
        self.publishStateAction(fieldMeta, value);
      },
      get() {
        return self.bean[proxyField];
      },
    });
  }
}
