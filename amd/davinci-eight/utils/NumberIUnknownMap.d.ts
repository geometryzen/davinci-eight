import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
declare class NumberIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
    private _elements;
    constructor();
    protected destructor(): void;
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
