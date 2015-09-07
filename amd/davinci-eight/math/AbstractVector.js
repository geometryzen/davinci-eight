define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var AbstractVector = (function () {
        function AbstractVector(data, size, modified) {
            if (modified === void 0) { modified = false; }
            this._size = expectArg('size', size).toBeNumber().toSatisfy(size >= 0, "size must be positive").value;
            this._data = expectArg('data', data).toBeObject().toSatisfy(data.length === size, "data length must be " + size).value;
            this.modified = expectArg('modified', modified).toBeBoolean().value;
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
    return AbstractVector;
});
