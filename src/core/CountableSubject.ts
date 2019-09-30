import { Subject, Subscriber, Subscription, Observable } from 'rxjs';

export class CountableSubject<T> extends Subject<T> {
  private readonly _counter$: Subject<number> = new Subject<number>();

  _subscribe(subscriber: Subscriber<T>): Subscription {
    const observable = new Observable(_subscriber => {
      const _subscription = super._subscribe(_subscriber);

      return () => {
        _subscription.unsubscribe();
        this._counter$.next(this.observers.length);
      };
    });
    const subscription = observable.subscribe(subscriber);

    this._counter$.next(this.observers.length);

    return subscription;
  }

  subscribeCount(next: (value: number) => void) {
    this._counter$.subscribe(next);
  }
}
