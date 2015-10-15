import IUnknown = require('../core/IUnknown');
/**
 * @class StringIUnknownMap<V extends IUnknown>
 * @extends IUnknown
 */
declare class StringIUnknownMap<V extends IUnknown> implements IUnknown {
    private _refCount;
    private _elements;
    private _uuid;
    private _userName;
    /**
     * <p>
     * A map&lt;V&gt; of <code>string</code> to <code>V extends IUnknown</code>.
     * </p>
     * @class StringIUnknownMap
     * @constructor
     */
    constructor(userName: string);
    addRef(): number;
    release(): number;
    /**
     * Determines whether the key exists in the map with a defined value.
     * @method exists
     * @param key {string}
     * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
     */
    exists(key: string): boolean;
    get(key: string): V;
    getWeakRef(key: string): V;
    put(key: string, value: V): void;
    /**
     * @method putWeakRef
     * @param key {string}
     * @param value {V}
     * @return {void}
     * @private
     */
    putWeakRef(key: string, value: V): void;
    forEach(callback: (key: string, value: V) => void): void;
    keys: string[];
    values: V[];
    remove(key: string): V;
}
export = StringIUnknownMap;
