type EventListenFn = (...args: any) => void
type EventTypes = Map<string | symbol, EventListenFn[]>
export class Event {
    events: EventTypes = new Map()
    on(evtName: string | symbol, cb: EventListenFn) {
        this.events.set(evtName, (this.events.get(evtName) || []).concat(cb))
    }
    emit(evtName: string | symbol, data: any) {
        if (this.events.has(evtName)) {
            this.events.get(evtName)!.forEach(cb => {
                cb(data)
            });
        }
    }
    off(evtName: string | symbol, cb: EventListenFn) {
        console.log(evtName)
        if (this.events.has(evtName)) {
            let len = this.events.get(evtName)!.length
            this.events.set(evtName, this.events.get(evtName)!.filter(c => c !== cb))
            let len2 = this.events.get(evtName)!.length
            console.log(len, '=>', len2)

        }
    }
}