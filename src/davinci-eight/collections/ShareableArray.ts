import Shareable from '../core/Shareable';
import ShareableBase from '../core/ShareableBase';

/**
 * Essentially constructs the ShareableArray without incrementing the
 * reference count of the elements, and without creating zombies.
 */
function transferOwnership<T extends Shareable>(data: T[]): ShareableArray<T> {
    if (data) {
        var result = new ShareableArray<T>(data)
        // The result has now taken ownership of the elements, so we can release.
        for (var i = 0, iLength = data.length; i < iLength; i++) {
            var element = data[i]
            if (element) {
                element.release()
            }
        }
        return result
    }
    else {
        return void 0
    }
}

/**
 * @class ShareableArray
 * @extends ShareableBase
 */
export default class ShareableArray<T extends Shareable> extends ShareableBase {
    /**
     * @property _elements
     * @type {T[]}
     * @private
     */
    private _elements: T[];
    /**
     * Collection class for maintaining an array of types derived from Shareable.
     * Provides a safer way to maintain reference counts than a native array.
     * @class ShareableArray
     * @constructor
     */
    constructor(elements: T[] = []) {
        super('ShareableArray')
        this._elements = elements
        for (var i = 0, l = this._elements.length; i < l; i++) {
            this._elements[i].addRef()
        }
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        for (var i = 0, l = this._elements.length; i < l; i++) {
            this._elements[i].release()
        }
        this._elements = void 0
        // Don't set the userName property to undefined so that we can report zombie calls.
        super.destructor()
    }

    find(match: (element: T) => boolean): ShareableArray<T> {
        const result = new ShareableArray<T>()
        const elements = this._elements
        const iLen = elements.length
        for (let i = 0; i < iLen; i++) {
            const candidate = elements[i]
            if (match(candidate)) {
                result.push(candidate)
            }
        }
        return result
    }

    findOne(match: (element: T) => boolean): T {
        const elements = this._elements
        for (let i = 0, iLength = elements.length; i < iLength; i++) {
            const candidate = elements[i]
            if (match(candidate)) {
                candidate.addRef()
                return candidate
            }
        }
        return void 0
    }

    /**
     * Gets the element at the specified index, incrementing the reference count.
     * @method get
     * @param index {number}
     * @return {T}
     */
    get(index: number): T {
        const element = this.getWeakRef(index)
        if (element) {
            element.addRef()
        }
        return element
    }
    /**
     * Gets the element at the specified index, without incrementing the reference count.
     * @method getWeakRef
     * @param index {number}
     * @return {T}
     */
    getWeakRef(index: number): T {
        return this._elements[index]
    }
    /**
     * @method indexOf
     * @param searchElement {T}
     * @param [fromIndex]
     * @return {number}
     */
    indexOf(searchElement: T, fromIndex?: number): number {
        return this._elements.indexOf(searchElement, fromIndex);
    }
    /**
     * @property length
     * @return {number}
     */
    get length(): number {
        if (this._elements) {
            return this._elements.length;
        }
        else {
            console.warn("ShareableArray is now a zombie, length is undefined")
            return void 0
        }
    }
    /**
     * The slice() method returns a shallow copy of a portion of an array into a new array object.
     * It does not remove elements from the original array.
     * @method slice
     * @param [begin] {number}
     * @param [end] {number}
     */
    slice(begin?: number, end?: number): ShareableArray<T> {
        return new ShareableArray<T>(this._elements.slice(begin, end))
    }
    /**
     * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
     * @method splice
     * @param index {number}
     * @param deleteCount {number}
     * @return {IUnkownArray<T>}
     */
    splice(index: number, deleteCount: number): ShareableArray<T> {
        // The release burdon is on the caller now.
        return transferOwnership(this._elements.splice(index, deleteCount))
    }
    /**
     * @method shift
     * @return {T}
     */
    shift(): T {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.shift()
    }
    /**
     * Traverse without Reference Counting
     * @method forEach
     * @param callback {(value: T, index: number)=>void}
     * @return {void}
     */
    forEach(callback: (value: T, index: number) => void): void {
        return this._elements.forEach(callback);
    }
    /**
     * Pushes an element onto the tail of the list and increments the element reference count.
     * @method push
     * @param element {T}
     * @return {number}
     */
    push(element: T): number {
        if (element) {
            element.addRef()
        }
        return this.pushWeakRef(element)
    }
    /**
     * Pushes an element onto the tail of the list without incrementing the element reference count.
     * @method pushWeakRef
     * @param element {T}
     * @return {number}
     */
    pushWeakRef(element: T): number {
        return this._elements.push(element)
    }
    /**
     * @method pop
     * @return {T}
     */
    pop(): T {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.pop()
    }
    unshift(element: T): number {
        element.addRef()
        return this.unshiftWeakRef(element)
    }
    unshiftWeakRef(element: T): number {
        return this._elements.unshift(element)
    }
}
