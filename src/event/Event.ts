import { ClassType } from '../types';

type EventListenFn = (...args: unknown[]) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventTypes = WeakMap<InstanceType<ClassType<any>>, EventListenFn[]>;

/**
 * the event emitter for the StatedBean
 *
 * @export
 * @class Event
 */
export class Event {
  events: EventTypes = new WeakMap();

  on(type: InstanceType<ClassType>, cb: EventListenFn) {
    this.events.set(type, (this.events.get(type) || []).concat(cb));
  }

  emit(type: InstanceType<ClassType>, ...data: unknown[]) {
    if (this.events.has(type)) {
      this.events.get(type)!.forEach(cb => {
        // eslint-disable-next-line standard/no-callback-literal
        cb(...data);
      });
    }
  }

  off(type: InstanceType<ClassType>, cb: EventListenFn) {
    if (this.events.has(type)) {
      this.events.set(type, this.events.get(type)!.filter(c => c !== cb));
    }
  }
}
