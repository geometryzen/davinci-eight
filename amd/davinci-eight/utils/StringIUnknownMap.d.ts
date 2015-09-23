import IUnknown = require('../core/IUnknown');
declare class StringIUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    /**
     * <p>
     * A map&lt;V&gt; of <code>string</code> to <code>V extends IUnknown</code>.
     * </p>
     * @class StringIUnknownMap
     * @constructor
     */
    constructor();
    addRef(): number;
    release(): number;
    /**
     * Determines whether the key exists in the map with a defined value.
     * @method exists
     * @param key {string}
     * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
     */
    exists(key: string): boolean;
    getStrongReference(key: string): V;
    getWeakReference(key: string): V;
    putStrongReference(key: string, value: V): void;
    putWeakReference(key: string, value: V): void;
    forEach(callback: (key: string, value: V) => void): void;
    keys: string[];
    remove(key: string): void;
}
export = StringIUnknownMap;
