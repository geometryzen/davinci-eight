import IUnknown = require('../core/IUnknown');
/**
 * @class StringIUnknownMap<V extends IUnknown>
 * @extends IUnknown
 */
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
    get(key: string): V;
    /**
     * @method getWeakReference
     * @param key {string}
     * @return {V}
     * @private
     */
    private getWeakReference(key);
    put(key: string, value: V): void;
    /**
     * @method putWeakReference
     * @param key {string}
     * @param value {V}
     * @return {void}
     * @private
     */
    private putWeakReference(key, value);
    forEach(callback: (key: string, value: V) => void): void;
    keys: string[];
    remove(key: string): void;
}
export = StringIUnknownMap;
