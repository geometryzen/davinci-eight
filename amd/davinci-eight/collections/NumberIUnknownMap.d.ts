import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
/**
 * @class NumberIUnknownMap&lt;V extends IUnknown&gt;
 * @extends Shareable
 */
declare class NumberIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
    /**
     * @property _elements
     * @private
     */
    private _elements;
    /**
     * @class NumberIUnknownMap&lt;V extends IUnknown&gt;
     * @constructor
     */
    constructor();
    /**
     * @property destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method exists
     * @param {number}
     * @return {boolean}
     */
    exists(key: number): boolean;
    /**
     * @method get
     * @param key {number}
     * @return {V}
     */
    get(key: number): V;
    /**
     * @method getWeakRef
     * @param key {number}
     * @return {V}
     */
    getWeakRef(index: number): V;
    /**
     * @method put
     * @param key {number}
     * @param value {V}
     * @return {void}
     */
    put(key: number, value: V): void;
    /**
     * @method putWeakRef
     * @param key {number}
     * @param value {V}
     * @return {void}
     */
    putWeakRef(key: number, value: V): void;
    /**
     * @method forEach
     * @param callback {(key: number, value: V) => void}
     * @return {void}
     */
    forEach(callback: (key: number, value: V) => void): void;
    /**
     * @property keys
     * @type {number[]}
     */
    keys: number[];
    /**
     * @method remove
     * @param key {number}
     * @return {void}
     */
    remove(key: number): void;
}
export = NumberIUnknownMap;
