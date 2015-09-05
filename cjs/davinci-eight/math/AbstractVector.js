var expectArg = require('../checks/expectArg');
var AbstractVector = (function () {
    function AbstractVector(data, size) {
        this._data = data;
        this._size = size;
        this.modified = false;
    }
    Object.defineProperty(AbstractVector.prototype, "data", {
        get: function () {
            if (this._data) {
                return this._data;
            }
            else if (this._callback) {
                var data = this._callback();
                expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
                return this._callback();
            }
            else {
                throw new Error("Vector" + this._size + " is undefined.");
            }
        },
        set: function (data) {
            expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
            this._data = data;
            this._callback = void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractVector.prototype, "callback", {
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
    return AbstractVector;
})();
module.exports = AbstractVector;
