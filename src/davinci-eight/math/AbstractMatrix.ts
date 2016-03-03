import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import MutableMatrix from '../math/MutableMatrix';
import expectArg from '../checks/expectArg';
import readOnly from '../i18n/readOnly';

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 *
 * @class AbstractMatrix
 */
export default class AbstractMatrix<T extends { elements: Float32Array }> implements MutableMatrix<Float32Array> {

    /**
     * @property _elements
     * @type {Float32Array}
     * @private
     */
    private _elements: Float32Array;

    /**
     * @property _length
     * @type {number}
     * @private
     */
    private _length: number;

    /**
     * @property _dimensions
     * @type {number}
     * @private
     */
    private _dimensions: number;

    /**
     * @property modified
     * @type {boolean}
     */
    public modified: boolean;

    /**
     * @class AbstractMatrix
     * @constructor
     * @param elements {Float32Array}
     * @param dimensions {number}
     */
    constructor(elements: Float32Array, dimensions: number) {
        this._elements = mustBeDefined('elements', elements)
        this._dimensions = mustBeInteger('dimensions', dimensions)
        this._length = dimensions * dimensions
        expectArg('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
        this.modified = false;
    }

    /**
     * @property dimensions
     * @type {number}
     * @readOnly
     */
    get dimensions(): number {
        return this._dimensions
    }
    set dimensions(unused) {
        throw new Error(readOnly('dimensions').message)
    }

    /**
     * @property elements
     * @type {Float32Array}
     */
    get elements(): Float32Array {
        return this._elements;
    }
    set elements(elements: Float32Array) {
        expectArg('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
        this._elements = elements;
    }

    /**
     * @method copy
     * @param m {T}
     * @return {T}
     * @chainable
     */
    copy(m: T): T {
        this.elements.set(m.elements)
        return <T><any>this;
    }

    /**
     * @method getElement
     * @param row {number} The zero-based row.
     * @param column {number} The zero-based column.
     * @return {number}
     */
    getElement(row: number, column: number): number {
        return this.elements[row + column * this._dimensions]
    }

    /**
     * Determines whether this matrix is the identity matrix.
     *
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        for (let i = 0; i < this._dimensions; i++) {
            for (let j = 0; j < this._dimensions; j++) {
                const value = this.getElement(i, j)
                if (i === j) {
                    if (value !== 1) {
                        return false
                    }
                }
                else {
                    if (value !== 0) {
                        return false
                    }
                }
            }
        }
        return true
    }

    /**
     * @method setElement
     * @param row {number} The zero-based row.
     * @param column {number} The zero-based column.
     * @param value {number} The value of the element.
     * @return {void}
     */
    setElement(row: number, column: number, value: number): void {
        this.elements[row + column * this._dimensions] = value
    }
}
