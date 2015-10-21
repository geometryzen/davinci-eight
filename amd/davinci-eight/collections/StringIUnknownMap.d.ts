import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
/**
 * @class StringIUnknownMap
 * @extends Shareable
 */
declare class StringIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
    /**
     * @property elements
     * @type {{[key: string]: V}}
     */
    private elements;
    /**
     * <p>
     * A map of <code>string</code> to <code>V extends IUnknown</code>.
     * </p>
     * @class StringIUnknownMap
     * @constructor
     */
    constructor();
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * Determines whether the key exists in the map with a defined value.
     * @method exists
     * @param key {string}
     * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
     */
    exists(key: string): boolean;
    /**
     * @method get
     * @param key {string}
     * @return {V}
     */
    get(key: string): V;
    /**
     * @method getWeakRef
     * @param key {string}
     * @return {V}
     */
    getWeakRef(key: string): V;
    /**
     * @method put
     * @param key {string}
     * @param value {V}
     * @return {void}
     */
    put(key: string, value: V): void;
    /**
     * @method putWeakRef
     * @param key {string}
     * @param value {V}
     * @return {void}
     */
    putWeakRef(key: string, value: V): void;
    /**
     * @method forEach
     * @param callback {(key: string, value: V) => void}
     */
    forEach(callback: (key: string, value: V) => void): void;
    /**
     * @property keys
     * @type {string[]}
     */
    keys: string[];
    /**
     * @property values
     * @type {V[]}
     */
    values: V[];
    /**
     * @method remove
     * @param key {string}
     * @return {V}
     */
    remove(key: string): V;
}
export = StringIUnknownMap;
