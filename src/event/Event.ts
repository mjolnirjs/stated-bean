import { ClassType } from '../types';

type EventListenFn = (...args: unknown[]) => void;

/**
 * the event emitter for the StatedBean
 *
 * @export
 * @class Event
 */
export class Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events = new WeakMap<InstanceType<ClassType<any>>, EventListenFn[]>();

  on(type: InstanceType<ClassType>, cb: EventListenFn) {
    this.events.set(type, (this.events.get(type) || []).concat(cb));
  }

  emit(type: InstanceType<ClassType>, ...data: unknown[]) {
    if (this.events.has(type)) {
      this.events.get(type)!.forEach(emit => emit(...data));
    }
  }

  off(type: InstanceType<ClassType>, cb: EventListenFn) {
    if (this.events.has(type)) {
      this.events.set(type, this.events.get(type)!.filter(c => c !== cb));
    }
  }
}
