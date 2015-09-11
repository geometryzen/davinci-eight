import IUnknown = require('../core/IUnknown');
declare class IUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    constructor();
    addRef(): number;
    release(): number;
    exists(key: string): boolean;
    get(key: string): V;
    put(key: string, value: V): void;
    forEach(callback: (key: string) => void): void;
    keys: string[];
    remove(key: string): void;
}
export = IUnknownMap;
