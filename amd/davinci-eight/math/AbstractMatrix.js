define(["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/expectArg', '../i18n/readOnly'], function (require, exports, mustBeDefined, mustBeInteger, expectArg, readOnly) {
    /**
     * @class AbstractMatrix
     */
    var AbstractMatrix = (function () {
        /**
         * @class AbstractMatrix
         * @constructor
         * @param elements {Float32Array}
         * @param dimensions {number}
         */
        function AbstractMatrix(elements, dimensions) {
            this._elements = mustBeDefined('elements', elements);
            this._dimensions = mustBeInteger('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            /**
             * @property elements
             * @type {Float32Array}
             */
            get: function () {
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
            },
            set: function (elements) {
                expectArg('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                this._elements = elements;
                this._callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
            /**
             * @property callback
             * @type {() => Float32Array}
             */
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._elements = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            /**
             * @property dimensions
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._dimensions;
            },
            set: function (unused) {
                throw new Error(readOnly('dimensions').message);
            },
            enumerable: true,
            configurable: true
        });
        return AbstractMatrix;
    })();
    return AbstractMatrix;
});
