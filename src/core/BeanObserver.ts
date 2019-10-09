import { Subject, BehaviorSubject } from 'rxjs';

import { getMetadataStorage } from '../metadata';
import {
  EffectAction,
  StateAction,
  StatedBeanMeta,
  StatedFieldMeta,
  StrictBeanProvider,
  PropsFieldMeta,
} from '../types';
import { getPropertiesWithoutFunction } from '../utils';

import { CountableSubject } from './CountableSubject';
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
  props$: Subject<unknown> = new Subject();

  private readonly _beanMeta: StatedBeanMeta;

  private readonly _proxyBean: T;

  constructor(
    private readonly _container: StatedBeanContainer,
    private readonly _provider: StrictBeanProvider<T>,
  ) {
    const beanMeta = getMetadataStorage().getBeanMeta(this._provider.type);
    if (beanMeta === undefined) {
      this._beanMeta = {
        name: this._provider.identity,
        target: this._provider.type,
        statedFields: getPropertiesWithoutFunction(this._provider.bean).map(
          key => ({
            name: key,
            target: this._provider.type,
          }),
        ),
      };
      this._proxyBean = this._observePlainObject(this._provider.bean);
    } else {
      this._beanMeta = beanMeta;
      this._proxyBean = this._observe(this._provider.bean);
    }

    if (isBeanContainerAware(this.proxy)) {
      this.proxy.setBeanContainer(this._container);
    }
  }

  get proxy(): T {
    return this._proxyBean;
  }

  get bean(): T {
    return this._provider.bean;
  }

  destroy() {
    this.state$.complete();
    this.effect$.complete();
    if (isDisposableBean(this.proxy)) {
      this.proxy.destroy();
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

  private _observe(bean: T): T {
    // const proxyBean = this._createProxyBean(bean, fields);
    const proxyBean = (new Proxy(
      (bean as unknown) as object,
      {},
    ) as unknown) as T;

    this._defineStatedBean(proxyBean);

    const statedFields = this._beanMeta.statedFields || [];
    statedFields.forEach(field => {
      this._observeBeanField(proxyBean, field);
    });

    const propsFields = this._beanMeta.propsFields;

    if (propsFields !== undefined) {
      propsFields.forEach(field => {
        this._initPropsField(proxyBean, field, this._provider.props);
      });
      this.props$.subscribe((p: Record<string, unknown>) => {
        propsFields.forEach(field => {
          this._updatePropsField(bean, field, p);
        });
      });
    }

    setTimeout(() => {
      if (
        this._beanMeta.postMethod != null &&
        this._beanMeta.postMethod.descriptor !== undefined
      ) {
        const f = this._beanMeta.postMethod.descriptor.value;
        f!.apply(proxyBean);
      } else if (isInitializingBean(proxyBean)) {
        proxyBean.postProvided();
      }
    }, 0);
    return proxyBean;
  }

  private _observePlainObject(bean: T): T {
    const proxyBean = this._observe(bean);

    Object.keys(proxyBean).forEach((key: keyof T & string) => {
      if (typeof proxyBean[key] === 'function') {
        Object.defineProperty(proxyBean, key, {
          value: ((proxyBean[key] as unknown) as Function).bind(proxyBean),
        });
      }
    });
    return proxyBean;
  }

  // @internal
  private _defineStatedBean(bean: T) {
    const self = this;
    Object.defineProperty(bean, StatedBeanSymbol, {
      value: {
        identity: self._provider.identity,
        type: self._provider.type,
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
  private _observeBeanField(bean: T, fieldMeta: StatedFieldMeta) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v') as keyof T;

    Object.defineProperty(bean, proxyField, {
      writable: true,
      value: bean[fieldMeta.name as keyof T],
    });

    const self = this;
    Object.defineProperty(bean, fieldMeta.name.toString(), {
      set(value: T[keyof T]) {
        bean[proxyField] = value;
        self.publishStateAction(fieldMeta, value);
      },
      get() {
        return bean[proxyField];
      },
    });
  }

  private _initPropsField(
    bean: T,
    field: PropsFieldMeta,
    props?: Record<string, unknown>,
  ) {
    const propsValue = props === undefined ? undefined : props[field.prop];

    if (field.observable) {
      Reflect.set(
        (bean as unknown) as object,
        field.name,
        new BehaviorSubject(propsValue),
      );
    } else {
      Reflect.set((bean as unknown) as object, field.name, propsValue);
    }
  }

  private _updatePropsField(
    bean: T,
    field: PropsFieldMeta,
    props?: Record<string, unknown>,
  ) {
    const newValue = props === undefined ? undefined : props[field.prop];
    const oldValue = Reflect.get((bean as unknown) as object, field.name);
    if (field.observable) {
      const subject = oldValue as BehaviorSubject<unknown>;

      if (!Object.is(subject.getValue(), newValue)) {
        subject.next(newValue);
      }
    } else {
      if (!Object.is(oldValue, newValue)) {
        Reflect.set((bean as unknown) as object, field.name, newValue);
      }
    }
  }

  // private _createProxyBean(bean: T, fields: StatedFieldMeta[]): T {
  //   const self = this;
  //   const proxy = new Proxy((bean as unknown) as object, {
  //     set: function(obj, prop, value) {
  //       console.log(obj);
  //       Reflect.set(obj, prop, value);
  //       const p = typeof prop === 'number' ? String(prop) : prop;
  //       const field = fields.find(f => f.name === p);
  //       console.log('proxy setter', prop);
  //       if (field !== undefined) {
  //         self.publishStateAction(field, value);
  //       }
  //       return true;
  //     },
  //     // get: function(obj, prop) {
  //     //   return Reflect.get(obj, prop);
  //     // },
  //   });

  //   return (proxy as unknown) as T;
  // }
}
