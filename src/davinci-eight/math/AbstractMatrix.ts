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
 * The underlying data storage is Float32Array.
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
}
