define(["require", "exports", '../checks/mustBeInteger', '../checks/expectArg'], function (require, exports, mustBeInteger, expectArg) {
    /**
     * @class AbstractMatrix
     */
    var AbstractMatrix = (function () {
        /**
         * @class AbstractMatrix
         * @constructor
         * @param data {Float32Array}
         * @param dimensions {number}
         */
        function AbstractMatrix(data, dimensions) {
            this._dimensions = mustBeInteger('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg('data', data).toSatisfy(data.length === this._length, 'data must have length ' + this._length);
            this._data = data;
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            /**
             * @property data
             * @type {Float32Array}
             */
            get: function () {
                if (this._data) {
                    return this._data;
                }
                else if (this._callback) {
                    var data = this._callback();
                    expectArg('callback()', data).toSatisfy(data.length === this._length, "callback() length must be " + this._length);
                    return this._callback();
                }
                else {
                    throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === this._length, "data length must be " + this._length);
                this._data = data;
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
                this._data = void 0;
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
            enumerable: true,
            configurable: true
        });
        return AbstractMatrix;
    })();
    return AbstractMatrix;
});
