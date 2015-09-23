define(["require", "exports", '../utils/refChange', '../utils/uuid4'], function (require, exports, refChange, uuid4) {
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
                    self_1.putStrongReference(key, void 0);
                });
                this._elements = void 0;
            }
            return this._refCount;
        };
        NumberIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        NumberIUnknownMap.prototype.getStrongReference = function (key) {
            var element = this.getWeakReference(key);
            if (element) {
                element.addRef();
            }
            return element;
        };
        NumberIUnknownMap.prototype.getWeakReference = function (index) {
            return this._elements[index];
        };
        NumberIUnknownMap.prototype.putStrongReference = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakReference(key, value);
        };
        NumberIUnknownMap.prototype.putWeakReference = function (key, value) {
            var elements = this._elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
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
            // Strong or Weak doesn't matter because the value is `undefined`.
            this.putStrongReference(key, void 0);
            delete this._elements[key];
        };
        return NumberIUnknownMap;
    })();
    return NumberIUnknownMap;
});
