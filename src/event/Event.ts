type EventListenFn = (...args: any) => void;
type EventTypes = WeakMap<Function, EventListenFn[]>;

export class Event {
  events: EventTypes = new WeakMap();

  on(type: Function, cb: EventListenFn) {
    this.events.set(type, (this.events.get(type) || []).concat(cb));
  }

  emit(type: Function, ...data: any) {
    if (this.events.has(type)) {
      this.events.get(type)!.forEach(cb => {
        cb(...data);
      });
    }
  }

  off(type: Function, cb: EventListenFn) {
    if (this.events.has(type)) {
      this.events.set(type, this.events.get(type)!.filter(c => c !== cb));
    }
  }
}
