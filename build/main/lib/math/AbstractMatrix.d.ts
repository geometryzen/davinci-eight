import { Lockable } from '../core/Lockable';
/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
export declare class AbstractMatrix<T extends {
    elements: Float32Array;
}> implements Lockable {
    private lock_;
    private elements_;
    private length_;
    private dimensions_;
    /**
     *
     */
    modified: boolean;
    /**
     * @param elements
     * @param dimensions
     */
    constructor(elements: Float32Array, dimensions: number);
    isLocked(): boolean;
    lock(): number;
    unlock(token: number): void;
    dimensions: number;
    elements: Float32Array;
    copy(m: T): T;
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number;
    /**
     * Determines whether this matrix is the identity matrix.
     */
    isOne(): boolean;
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    setElement(row: number, column: number, value: number): void;
}
