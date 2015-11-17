import mustBeDefined = require('../checks/mustBeDefined')
import mustBeInteger = require('../checks/mustBeInteger')
import MutableMatrix = require('../math/MutableMatrix')
import expectArg = require('../checks/expectArg')
import readOnly = require('../i18n/readOnly')

/**
 * @class AbstractMatrix
 */
class AbstractMatrix implements MutableMatrix<Float32Array> {
    /**
     * @property _elements
     * @type {Float32Array}
     * @private
     */
    private _elements: Float32Array;
    private _callback: () => Float32Array;

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
        if (this._elements) {
            return this._elements;
        }
        else if (this._callback) {
            var elements = this._callback();
            expectArg('callback()', elements).toSatisfy(elements.length === this._length, "callback() length must be " + this._length);
            return this._callback();
        }
        else {
            throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
        }
    }
    set elements(elements: Float32Array) {
        expectArg('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
        this._elements = elements;
        this._callback = void 0;
    }

    /**
     * @property callback
     * @type {() => Float32Array}
     */
    get callback() {
        return this._callback;
    }
    set callback(reactTo: () => Float32Array) {
        this._callback = reactTo;
        this._elements = void 0;
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

export = AbstractMatrix;