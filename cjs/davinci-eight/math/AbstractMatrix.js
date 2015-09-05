var expectArg = require('../checks/expectArg');
var AbstractMatrix = (function () {
    function AbstractMatrix(data, length) {
        expectArg('data', data).toSatisfy(data.length === length, 'data must have length ' + length);
        this._data = data;
        this._length = length;
        this.modified = false;
    }
    Object.defineProperty(AbstractMatrix.prototype, "data", {
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
    return AbstractMatrix;
})();
module.exports = AbstractMatrix;
