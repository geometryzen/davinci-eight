import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
/**
 * @class NumberIUnknownMap<V>
 */
declare class NumberIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
    private _elements;
    /**
     * @class NumberIUnknownMap<V>
     * @constructor
     */
    constructor();
    protected destructor(): void;
    exists(key: number): boolean;
    get(key: number): V;
    getWeakReference(index: number): V;
    put(key: number, value: V): void;
    putWeakReference(key: number, value: V): void;
    forEach(callback: (key: number, value: V) => void): void;
    keys: number[];
    remove(key: number): void;
}
export = NumberIUnknownMap;
