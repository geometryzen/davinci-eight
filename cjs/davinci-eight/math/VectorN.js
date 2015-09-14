var expectArg = require('../checks/expectArg');
var isDefined = require('../checks/isDefined');
var isUndefined = require('../checks/isUndefined');
function constructorString(T) {
    return "new VectorN<" + T + ">(data: " + T + "[], modified: boolean = false, size?: number)";
}
function pushString(T) {
    return "push(value: " + T + "): number";
}
function popString(T) {
    return "pop(): " + T;
}
function contextNameKind(context, name, kind) {
    return name + " must be a " + kind + " in " + context;
}
function contextNameLength(context, name, length) {
    return name + " length must be " + length + " in " + context;
}
function ctorDataKind() {
    return contextNameKind(constructorString('T'), 'data', 'T[]');
}
function ctorDataLength(length) {
    return function () {
        return contextNameLength(constructorString('T'), 'data', length);
    };
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
function ctorModifiedKind() {
    return contextNameKind(constructorString('T'), 'modified', 'boolean');
}
function ctorSizeKind() {
    return contextNameKind(constructorString('T'), 'size', 'number');
}
var VectorN = (function () {
    function VectorN(data, modified, size) {
        if (modified === void 0) { modified = false; }
        var dataArg = expectArg('data', data).toBeObject(ctorDataKind);
        this.modified = expectArg('modified', modified).toBeBoolean(ctorModifiedKind).value;
        if (isDefined(size)) {
            this._size = expectArg('size', size).toBeNumber(ctorSizeKind).toSatisfy(size >= 0, "size must be positive").value;
            this._data = dataArg.toSatisfy(data.length === size, ctorDataLength(size)()).value;
        }
        else {
            this._size = void 0;
            this._data = dataArg.value;
        }
    }
    Object.defineProperty(VectorN.prototype, "data", {
        get: function () {
            if (this._data) {
                return this._data;
            }
            else if (this._callback) {
                var data = this._callback();
                if (isDefined(this._size)) {
                    expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
                }
                return this._callback();
            }
            else {
                throw new Error("Vector" + this._size + " is undefined.");
            }
        },
        set: function (data) {
            if (isDefined(this._size)) {
                expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
            }
            this._data = data;
            this._callback = void 0;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorN.prototype, "length", {
        get: function () {
            return this.data.length;
        },
        enumerable: true,
        configurable: true
    });
    VectorN.prototype.clone = function () {
        return new VectorN(this._data, this.modified, this._size);
    };
    VectorN.prototype.getComponent = function (index) {
        return this.data[index];
    };
    VectorN.prototype.pop = function () {
        if (isUndefined(this._size)) {
            return this.data.pop();
        }
        else {
            throw new Error(verbotenPop());
        }
    };
    // FIXME: How to prototype this as ...items: T[]
    VectorN.prototype.push = function (value) {
        if (isUndefined(this._size)) {
            var data = this.data;
            var newLength = data.push(value);
            this.data = data;
            return newLength;
        }
        else {
            throw new Error(verbotenPush());
        }
    };
    VectorN.prototype.setComponent = function (index, value) {
        var data = this.data;
        var existing = data[index];
        if (value !== existing) {
            data[index] = value;
            this.data = data;
            this.modified = true;
        }
    };
    VectorN.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        var data = this.data;
        var length = data.length;
        for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
        }
        return array;
    };
    VectorN.prototype.toLocaleString = function () {
        return this.data.toLocaleString();
    };
    VectorN.prototype.toString = function () {
        return this.data.toString();
    };
    return VectorN;
})();
module.exports = VectorN;
