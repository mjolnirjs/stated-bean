export type EventListenFn = (...args: unknown[]) => void;

/**
 * the event emitter for the StatedBean
 *
 * @export
 * @class Event
 */
export class Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events = new WeakMap<any, EventListenFn[]>();

  on<T>(bean: T, cb: EventListenFn) {
    this.events.set(bean, (this.events.get(bean) || []).concat(cb));
  }

  emit<T>(bean: T, ...data: unknown[]) {
    if (this.events.has(bean)) {
      this.events.get(bean)!.forEach(emit => emit(...data));
    }
  }

  off<T>(bean: T, cb: EventListenFn) {
    if (this.events.has(bean)) {
      this.events.set(bean, this.events.get(bean)!.filter(c => c !== cb));
    }
  }

  isEmpty<T>(bean: T) {
    const listeners = this.events.get(bean);
    return listeners === undefined || listeners.length === 0;
  }
}
