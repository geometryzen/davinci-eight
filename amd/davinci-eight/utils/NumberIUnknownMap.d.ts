import IUnknown = require('../core/IUnknown');
declare class NumberIUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    constructor();
    addRef(): number;
    release(): number;
    exists(key: number): boolean;
    get(key: number): V;
    put(key: number, value: V): void;
    forEach(callback: (key: number, value: V) => void): void;
    keys: number[];
    remove(key: number): void;
}
export = NumberIUnknownMap;
