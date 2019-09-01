import { ClassType } from '../types';

type EventListenFn = (...args: any[]) => void;
type EventTypes = WeakMap<InstanceType<ClassType>, EventListenFn[]>;

export class Event {
  events: EventTypes = new WeakMap();

  on(type: InstanceType<ClassType>, cb: EventListenFn) {
    console.log('on', type);
    this.events.set(type, (this.events.get(type) || []).concat(cb));
  }

  emit(type: InstanceType<ClassType>, ...data: any[]) {
    if (this.events.has(type)) {
      this.events.get(type)!.forEach(cb => {
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
