import IUnknown = require('../core/IUnknown');
declare class NumberIUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    constructor();
    addRef(): number;
    release(): number;
    exists(key: number): boolean;
    getStrongReference(key: number): V;
    getWeakReference(index: number): V;
    putStrongReference(key: number, value: V): void;
    putWeakReference(key: number, value: V): void;
    forEach(callback: (key: number, value: V) => void): void;
    keys: number[];
    remove(key: number): void;
}
export = NumberIUnknownMap;
