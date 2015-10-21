import Mutable = require('../math/Mutable');
/**
 * @class VectorN<T>
 */
declare class VectorN<T> implements Mutable<T[]> {
    private _size;
    private _data;
    private _callback;
    /**
     * @property modified
     * @type {boolean}
     */
    modified: boolean;
    /**
     * @class VectorN<T>
     * @constructor
     * @param data {T[]}
     * @param modified [boolean = false]
     * @param [size]
     */
    constructor(data: T[], modified?: boolean, size?: number);
    /**
     * @property data
     * @type {T[]}
     */
    data: T[];
    /**
     * @property callback
     * @type {() => T[]}
     */
    callback: () => T[];
    /**
     * @property length
     * @type {number}
     * @readOnly
     */
    length: number;
    /**
     * @method clone
     * @return {VectorN<T>}
     */
    clone(): VectorN<T>;
    /**
     * @method getComponent
     * @param index {number}
     * @return {T}
     */
    getComponent(index: number): T;
    /**
     * @method pop
     * @return {T}
     */
    pop(): T;
    /**
     * @method push
     * @param value {T}
     * @return {number}
     */
    push(value: T): number;
    /**
     * @method setComponent
     * @param index {number}
     * @param value {T}
     * @return {void}
     */
    setComponent(index: number, value: T): void;
    /**
     * @method toArray
     * @param [array = []] {T[]}
     * @param [offset = 0] {number}
     * @return {T[]}
     */
    toArray(array?: T[], offset?: number): T[];
    /**
     * @method toLocaleString
     * @return {string}
     */
    toLocaleString(): string;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
}
export = VectorN;
