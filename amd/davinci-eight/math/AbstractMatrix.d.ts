import MutableMatrix = require('../math/MutableMatrix');
/**
 * @class AbstractMatrix
 */
declare class AbstractMatrix implements MutableMatrix<Float32Array> {
    /**
     * @property _elements
     * @type {Float32Array}
     * @private
     */
    private _elements;
    private _callback;
    /**
     * @property _length
     * @type {number}
     * @private
     */
    private _length;
    /**
     * @property _dimensions
     * @type {number}
     * @private
     */
    private _dimensions;
    /**
     * @property modified
     * @type {boolean}
     */
    modified: boolean;
    /**
     * @class AbstractMatrix
     * @constructor
     * @param elements {Float32Array}
     * @param dimensions {number}
     */
    constructor(elements: Float32Array, dimensions: number);
    /**
     * @property elements
     * @type {Float32Array}
     */
    elements: Float32Array;
    /**
     * @property callback
     * @type {() => Float32Array}
     */
    callback: () => Float32Array;
    /**
     * @property dimensions
     * @type {number}
     * @readOnly
     */
    dimensions: number;
}
export = AbstractMatrix;
