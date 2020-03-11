import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { EffectAction, PropsFieldMeta, StateAction, StatedFieldMeta, StatedBeanMeta } from '../types';
import { getBeanWrapper } from '../utils';

import { BeanDefinition } from './BeanDefinition';
import { BeanWrapper } from './BeanWrapper';
import { CountableSubject } from './CountableSubject';
import { isBeanContainerAware, isDisposableBean, isInitializingBean } from './LifeCycle';
import { StatedBeanContainer } from './StatedBeanContainer';
import { StatedBeanWrapper } from './Symbols';
import { shallowEqual } from './shallowEqual';

export class BeanObserver<T = unknown> {
  state$: CountableSubject<StateAction<T>> = new CountableSubject();
  effect$: Subject<EffectAction> = new Subject();
  props$: Subject<unknown> = new Subject();

  private readonly _proxyBean: T;
  private readonly _beanMeta: StatedBeanMeta;
  private readonly _stateSubscription: Subscription | undefined;

  constructor(private readonly _bean: T, private readonly _container: StatedBeanContainer, private readonly _beanDefinition: BeanDefinition<T>) {
    this._beanMeta = this.beanDefinition.beanMeta;
    this._proxyBean = (new Proxy((this.origin as unknown) as object, {}) as unknown) as T;
    const wrapper = this._observe();

    this._stateSubscription = wrapper.state$.subscribe(this.state$);

    if (isBeanContainerAware(this.proxy)) {
      this.proxy.setBeanContainer(this._container);
    }
  }

  get beanDefinition() {
    return this._beanDefinition;
  }

  get proxy(): T {
    return this._proxyBean;
  }

  get origin(): T {
    return this._bean;
  }

  get beanMeta() {
    return this._beanMeta;
  }

  destroy() {
    this.state$.complete();
    this.effect$.complete();
    if (isDisposableBean(this.proxy)) {
      this.proxy.destroy();
    }

    if (this._stateSubscription !== undefined) {
      this._stateSubscription.unsubscribe();
    }
  }

  publishStateAction(fieldMeta: StatedFieldMeta, value: T[keyof T]) {
    const action: StateAction<T> = {
      bean: this.proxy,
      nextValue: value,
      prevValue: this.proxy[fieldMeta.name as keyof T],
      fieldMeta,
    };

    this.state$.next(action);
  }

  private _observe() {
    // const proxyBean = this._createProxyBean(bean, fields);
    const wrapper = this._defineStatedBean(this.proxy);
    const propsFields = this.beanMeta.propsFields;

    if (propsFields !== undefined) {
      propsFields.forEach(field => {
        this._initPropsField(this.proxy, field, this.beanDefinition.props);
      });
      this.props$.subscribe((p: Record<string, unknown>) => {
        propsFields.forEach(field => {
          this._updatePropsField(this.proxy, field, p);
        });
      });
    }

    setTimeout(() => {
      if (this.beanMeta.postMethod != null && this.beanMeta.postMethod.descriptor !== undefined) {
        const f = this.beanMeta.postMethod.descriptor.value;

        f!.apply(this.proxy);
      } else if (isInitializingBean(this.proxy)) {
        this.proxy.afterProvided();
      }
    }, 0);

    return wrapper;
  }

  // @internal
  private _defineStatedBean(bean: T): BeanWrapper<T> {
    let wrapper = getBeanWrapper(bean);

    if (wrapper === undefined) {
      wrapper = new BeanWrapper(this._container, this.beanDefinition.beanName);
      Object.defineProperty(bean, StatedBeanWrapper, {
        value: wrapper,
      });

      const statedFields = this.beanMeta.statedFields || [];

      statedFields.forEach(field => {
        this._observeBeanField(wrapper!, bean, field);
      });
    }

    return wrapper;
  }

  // @internal
  private _observeBeanField(wrapper: BeanWrapper<T>, bean: T, fieldMeta: StatedFieldMeta) {
    const proxyField = Symbol(fieldMeta.name.toString() + '_v') as keyof T;

    Object.defineProperty(bean, proxyField, {
      writable: true,
      value: bean[fieldMeta.name as keyof T],
    });

    Object.defineProperty(bean, fieldMeta.name.toString(), {
      set(value: T[keyof T]) {
        bean[proxyField] = value;
        const action = {
          bean,
          nextValue: value,
          prevValue: bean[fieldMeta.name as keyof T],
          fieldMeta,
        };

        wrapper.state$.next(action);
      },
      get() {
        return bean[proxyField];
      },
    });
  }

  private _initPropsField(bean: T, field: PropsFieldMeta, props?: unknown) {
    const propsValue = props === undefined ? undefined : (props as Record<string, unknown>)[field.prop];

    if (field.observable) {
      Reflect.set((bean as unknown) as object, field.name, new BehaviorSubject(propsValue));
    } else {
      Reflect.set((bean as unknown) as object, field.name, propsValue);
    }
  }

  private _updatePropsField(bean: T, field: PropsFieldMeta, props?: Record<string, unknown>) {
    const target = (bean as unknown) as object;
    const newValue = props === undefined ? undefined : props[field.prop];
    const oldValue = Reflect.get(target, field.name);

    if (field.observable) {
      const subject = oldValue as BehaviorSubject<unknown>;

      if (!shallowEqual(subject.getValue(), newValue)) {
        subject.next(newValue);
      }
    } else {
      if (!shallowEqual(oldValue, newValue)) {
        const propsName = String(field.name);
        const setter = Reflect.get(target, 'set' + propsName.charAt(0).toUpperCase() + propsName.slice(1));

        if (setter && typeof setter === 'function') {
          setter.apply(bean, [newValue]);
        } else {
          Reflect.set((bean as unknown) as object, field.name, newValue);
        }
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
