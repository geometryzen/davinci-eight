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
    constructor();
    /**
     * @method destructor
     * @return {void}
     */
    protected destructor(): void;
    /**
     * Gets the element at the specified index without incrementing the reference count.
     * Use this method when you don't intend to hold onto the returned value.
     * @method getWeakReference
     * @param index {number}
     * @return {T}
     */
    getWeakReference(index: number): T;
    /**
     * Gets the element at the specified index, incrementing the reference count.
     * Use this method when you intend to hold onto the referent and release it later.
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
    splice(index: number, count: number): T[];
    /**
     * Traverse without Reference Counting
     * @method forEach
     * @param callback {(value: T, index: number)=>void}
     * @return {void}
     */
    forEach(callback: (value: T, index: number) => void): void;
    /**
     * Pushes an element onto the tail of the list and increments the element reference count.
     * @method pushStrongReference
     * @param element {T}
     * @return {number}
     */
    pushStrongReference(element: T): number;
    /**
     * Pushes an element onto the tail of the list with no change in the reference count.
     * @method pushWeakReference
     * @param element {T}
     * @return {number}
     */
    pushWeakReference(element: T): number;
    /**
     * @method pop
     * @return {T}
     */
    pop(): T;
}
export = IUnknownArray;
