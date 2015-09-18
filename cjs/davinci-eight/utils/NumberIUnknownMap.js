var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
// FIXME: Maybe use a dynamic flag implying JIT keys, otherwise recompute as we go along.
var LOGGING_NAME = 'NumberIUnknownMap';
var NumberIUnknownMap = (function () {
    function NumberIUnknownMap() {
        this._refCount = 1;
        this._elements = {};
        this._uuid = uuid4().generate();
        refChange(this._uuid, LOGGING_NAME, +1);
    }
    NumberIUnknownMap.prototype.addRef = function () {
        refChange(this._uuid, LOGGING_NAME, +1);
        this._refCount++;
        return this._refCount;
    };
    NumberIUnknownMap.prototype.release = function () {
        refChange(this._uuid, LOGGING_NAME, -1);
        this._refCount--;
        if (this._refCount === 0) {
            var self_1 = this;
            this.forEach(function (key) {
                self_1.put(key, void 0);
            });
            this._elements = void 0;
        }
        return this._refCount;
    };
    NumberIUnknownMap.prototype.exists = function (key) {
        var element = this._elements[key];
        return element ? true : false;
    };
    NumberIUnknownMap.prototype.get = function (key) {
        var element = this._elements[key];
        if (element) {
            element.addRef();
            return element;
        }
        else {
            return void 0;
        }
    };
    NumberIUnknownMap.prototype.put = function (key, value) {
        var existing = this._elements[key];
        if (existing) {
            if (value) {
                if (existing === value) {
                }
                else {
                    existing.release();
                    value.addRef();
                    this._elements[key] = value;
                }
            }
            else {
                existing.release();
                this._elements[key] = void 0;
            }
        }
        else {
            // There is no entry at the key specified.
            if (value) {
                value.addRef();
                this._elements[key] = value;
            }
            else {
            }
        }
    };
    NumberIUnknownMap.prototype.forEach = function (callback) {
        var keys = this.keys;
        var i;
        var length = keys.length;
        for (i = 0; i < length; i++) {
            var key = keys[i];
            var value = this._elements[key];
            callback(key, value);
        }
    };
    Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
        get: function () {
            // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
            return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
        },
        enumerable: true,
        configurable: true
    });
    NumberIUnknownMap.prototype.remove = function (key) {
        this.put(key, void 0);
        delete this._elements[key];
    };
    return NumberIUnknownMap;
})();
module.exports = NumberIUnknownMap;
