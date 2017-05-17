export declare class EventEmitter<T, V> {
    private _eventRegistry;
    private owner;
    constructor(owner: T);
    addEventListener(eventName: string, callback: (eventName: string, key: string, value: V, source: T) => void): (eventName: string, key: string, value: V, source: T) => void;
    removeEventListener(eventName: string, callback: (eventName: string, key: string, value: V, source: T) => any): void;
    emit(eventName: string, key: string, value: V): any;
}
