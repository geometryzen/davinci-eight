import IUnknown = require('../core/IUnknown');
import Shareable = require('../utils/Shareable');
/**
 * @class IUnknownArray<T extends IUnknown>
 * @extends Shareable
 */
declare class IUnknownArray<T extends IUnknown> extends Shareable {
    /**
     * @property _elements
     * @type {T[]}
     * @private
     */
    private _elements;
    private userName;
    /**
     * Collection class for maintaining an array of types derived from IUnknown.
     * Provides a safer way to maintain reference counts than a native array.
     * @class IUnknownArray
     * @constructor
     */
    constructor(elements: T[], userName: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
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
     * Gets the element at the specified index, without incrementing the reference count.
     * @method getWeakRef
     * @param index {number}
     * @return {T}
     */
    getWeakRef(index: number): T;
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
    /**
     * The slice() method returns a shallow copy of a portion of an array into a new array object.
     * It does not remove elements from the original array.
     * @method slice
     * @param begin [number]
     * @param end [number]
     */
    slice(begin?: number, end?: number): IUnknownArray<T>;
    /**
     * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
     * @method splice
     * @param index {number}
     * @param deleteCount {number}
     * @return {IUnkownArray<T>}
     */
    splice(index: number, deleteCount: number): IUnknownArray<T>;
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
     * Pushes an element onto the tail of the list without incrementing the element reference count.
     * @method pushWeakRef
     * @param element {T}
     * @return {number}
     */
    pushWeakRef(element: T): number;
    /**
     * @method pop
     * @return {T}
     */
    pop(): T;
}
export = IUnknownArray;
