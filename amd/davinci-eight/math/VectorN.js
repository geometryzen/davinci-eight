define(["require", "exports", '../checks/isDefined', '../checks/isUndefined'], function (require, exports, isDefined_1, isUndefined_1) {
    function pushString(T) {
        return "push(value: " + T + "): number";
    }
    function popString(T) {
        return "pop(): " + T;
    }
    function verboten(operation) {
        return operation + " is not allowed for a fixed size vector";
    }
    function verbotenPush() {
        return verboten(pushString('T'));
    }
    function verbotenPop() {
        return verboten(popString('T'));
    }
    var VectorN = (function () {
        function VectorN(data, modified, size) {
            if (modified === void 0) { modified = false; }
            this.modified = modified;
            if (isDefined_1.default(size)) {
                this._size = size;
                this._data = data;
            }
            else {
                this._size = void 0;
                this._data = data;
            }
        }
        Object.defineProperty(VectorN.prototype, "coords", {
            get: function () {
                if (this._data) {
                    return this._data;
                }
                else if (this._callback) {
                    return this._callback();
                }
                else {
                    throw new Error("Vector" + this._size + " is undefined.");
                }
            },
            set: function (data) {
                this._data = data;
                this._callback = void 0;
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "callback", {
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._data = void 0;
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
            get: function () {
                return this.coords.length;
            },
            enumerable: true,
            configurable: true
        });
        VectorN.prototype.clone = function () {
            return new VectorN(this._data, this.modified, this._size);
        };
        VectorN.prototype.getComponent = function (index) {
            return this.coords[index];
        };
        VectorN.prototype.pop = function () {
            if (isUndefined_1.default(this._size)) {
                return this.coords.pop();
            }
            else {
                throw new Error(verbotenPop());
            }
        };
        VectorN.prototype.push = function (value) {
            if (isUndefined_1.default(this._size)) {
                var data = this.coords;
                var newLength = data.push(value);
                this.coords = data;
                return newLength;
            }
            else {
                throw new Error(verbotenPush());
            }
        };
        VectorN.prototype.setComponent = function (index, value) {
            var coords = this.coords;
            var previous = coords[index];
            if (value !== previous) {
                coords[index] = value;
                this.coords = coords;
                this.modified = true;
            }
        };
        VectorN.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            var data = this.coords;
            var length = data.length;
            for (var i = 0; i < length; i++) {
                array[offset + i] = data[i];
            }
            return array;
        };
        VectorN.prototype.toLocaleString = function () {
            return this.coords.toLocaleString();
        };
        VectorN.prototype.toString = function () {
            return this.coords.toString();
        };
        return VectorN;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorN;
});
