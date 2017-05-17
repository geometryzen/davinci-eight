import { Lockable } from '../core/Lockable';
import { lockable } from '../core/Lockable';
import { TargetLockedError } from '../core/Lockable';
import { mustBeDefined } from '../checks/mustBeDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { expectArg } from '../checks/expectArg';
import { readOnly } from '../i18n/readOnly';

/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
export class AbstractMatrix<T extends { elements: Float32Array }> implements Lockable {

    private lock_ = lockable();
    private elements_: Float32Array;
    private length_: number;
    private dimensions_: number;

    /**
     * 
     */
    public modified: boolean;

    /**
     * @param elements
     * @param dimensions
     */
    constructor(elements: Float32Array, dimensions: number) {
        this.elements_ = mustBeDefined('elements', elements);
        this.dimensions_ = mustBeInteger('dimensions', dimensions);
        this.length_ = dimensions * dimensions;
        expectArg('elements', elements).toSatisfy(elements.length === this.length_, 'elements must have length ' + this.length_);
        this.modified = false;
    }

    isLocked(): boolean {
        return this.lock_.isLocked();
    }

    lock(): number {
        return this.lock_.lock();
    }

    unlock(token: number): void {
        return this.lock_.unlock(token);
    }

    get dimensions(): number {
        return this.dimensions_;
    }
    set dimensions(unused) {
        throw new Error(readOnly('dimensions').message);
    }

    get elements(): Float32Array {
        return this.elements_;
    }
    set elements(elements: Float32Array) {
        if (this.isLocked()) {
            throw new TargetLockedError('elements');
        }
        expectArg('elements', elements).toSatisfy(elements.length === this.length_, "elements length must be " + this.length_);
        this.elements_ = elements;
    }

    copy(m: T): T {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
        this.elements.set(m.elements);
        return <T><any>this;
    }

    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number {
        return this.elements[row + column * this.dimensions_];
    }

    /**
     * Determines whether this matrix is the identity matrix.
     */
    isOne(): boolean {
        for (let i = 0; i < this.dimensions_; i++) {
            for (let j = 0; j < this.dimensions_; j++) {
                const value = this.getElement(i, j);
                if (i === j) {
                    if (value !== 1) {
                        return false;
                    }
                }
                else {
                    if (value !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    setElement(row: number, column: number, value: number): void {
        if (this.isLocked()) {
            throw new TargetLockedError('setElement');
        }
        this.elements[row + column * this.dimensions_] = value;
    }
}
