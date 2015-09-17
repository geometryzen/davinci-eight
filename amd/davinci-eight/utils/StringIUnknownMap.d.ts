import IUnknown = require('../core/IUnknown');
declare class StringIUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    constructor();
    addRef(): number;
    release(): number;
    exists(key: string): boolean;
    get(key: string): V;
    put(key: string, value: V): void;
    forEach(callback: (key: string, value: V) => void): void;
    keys: string[];
    remove(key: string): void;
}
export = StringIUnknownMap;
