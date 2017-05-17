import { Shareable } from '../core/Shareable';
import { ShareableBase } from '../core/ShareableBase';
/**
 * <p>
 * Collection class for maintaining an array of types derived from Shareable.
 * </p>
 * <p>
 * Provides a safer way to maintain reference counts than a native array.
 * </p>
 */
export declare class ShareableArray<T extends Shareable> extends ShareableBase {
    /**
     *
     */
    private _elements;
    /**
     *
     */
    constructor(elements?: T[]);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    find(match: (element: T) => boolean): ShareableArray<T>;
    /**
     *
     */
    findOne(match: (element: T) => boolean): T;
    /**
     * Gets the element at the specified index, incrementing the reference count.
     */
    get(index: number): T;
    /**
     * Gets the element at the specified index, without incrementing the reference count.
     */
    getWeakRef(index: number): T;
    /**
     *
     */
    indexOf(searchElement: T, fromIndex?: number): number;
    /**
     *
     */
    length: number;
    /**
     * The slice() method returns a shallow copy of a portion of an array into a new array object.
     *
     * It does not remove elements from the original array.
     */
    slice(begin?: number, end?: number): ShareableArray<T>;
    /**
     * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
     */
    splice(index: number, deleteCount: number): ShareableArray<T>;
    /**
     *
     */
    shift(): T;
    /**
     * Traverse without Reference Counting
     */
    forEach(callback: (value: T, index: number) => void): void;
    /**
     * Pushes <code>element</code> onto the tail of the list and increments the element reference count.
     */
    push(element: T): number;
    /**
     * Pushes <code>element</code> onto the tail of the list <em>without</em> incrementing the <code>element</code> reference count.
     */
    pushWeakRef(element: T): number;
    /**
     *
     */
    pop(): T;
    /**
     *
     */
    unshift(element: T): number;
    /**
     * <p>
     * <code>unshift</code> <em>without</em> incrementing the <code>element</code> reference count.
     * </p>
     */
    unshiftWeakRef(element: T): number;
}
