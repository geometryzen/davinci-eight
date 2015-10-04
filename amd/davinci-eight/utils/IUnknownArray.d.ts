import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
/**
 * @class IUnknownArray
 */
declare class IUnknownArray<T extends IUnknown> extends Shareable {
    private _elements;
    /**
     * Collection class for maintaining an array of types derived from IUnknown.
     * Provides a safer way to maintain reference counts than a native array.
     * @class IUnknownArray
     * @constructor
     */
    constructor(elements?: T[]);
    /**
     * @method destructor
     * @return {void}
     */
    protected destructor(): void;
    /**
     * Gets the element at the specified index, incrementing the reference count.
     * @method get
     * @param index {number}
     * @return {T}
     */
    get(index: number): T;
    /**
     * @method indexOf
     * @param searchElement {T}
     * @param [fromIndex]
     * @return {number}
     */
    indexOf(searchElement: T, fromIndex?: number): number;
    /**
     * @property length
     * @return {number}
     */
    length: number;
    slice(start?: number, end?: number): IUnknownArray<T>;
    /**
     * @method splice
     * @param index {number}
     * @param count {number}
     * @return {IUnnownArray<T>}
     */
    splice(index: number, count: number): IUnknownArray<T>;
    /**
     * @method shift
     * @return {T}
     */
    shift(): T;
    /**
     * Traverse without Reference Counting
     * @method forEach
     * @param callback {(value: T, index: number)=>void}
     * @return {void}
     */
    forEach(callback: (value: T, index: number) => void): void;
    /**
     * Pushes an element onto the tail of the list and increments the element reference count.
     * @method push
     * @param element {T}
     * @return {number}
     */
    push(element: T): number;
    /**
     * @method pop
     * @return {T}
     */
    pop(): T;
}
export = IUnknownArray;
