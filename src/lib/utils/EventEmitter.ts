export class EventEmitter<T, V> {

    private _eventRegistry: { [name: string]: ((eventName: string, key: string, value: V, source: T) => any)[] };
    private owner: T;

    constructor(owner: T) {
        this.owner = owner;
    }

    public addEventListener(eventName: string, callback: (eventName: string, key: string, value: V, source: T) => void) {
        this._eventRegistry = this._eventRegistry || {};

        let listeners = this._eventRegistry[eventName];
        if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
        }

        if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
        }
        return callback;
    }

    public removeEventListener(eventName: string, callback: (eventName: string, key: string, value: V, source: T) => any) {
        this._eventRegistry = this._eventRegistry || {};

        const listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    public emit(eventName: string, key: string, value: V): any {
        if (this._eventRegistry) {
            const listeners = this._eventRegistry[eventName];
            if (listeners) {
                const iLength = listeners.length;
                if (iLength) {
                    for (let i = 0; i < iLength; i++) {
                        listeners[i](eventName, key, value, this.owner);
                    }
                }
            }
        }
    }
}
