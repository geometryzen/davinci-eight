var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Shareable'], function (require, exports, Shareable_1) {
    var NumberIUnknownMap = (function (_super) {
        __extends(NumberIUnknownMap, _super);
        function NumberIUnknownMap() {
            _super.call(this, 'NumberIUnknownMap');
            this._elements = {};
        }
        NumberIUnknownMap.prototype.destructor = function () {
            this.forEach(function (key, value) {
                if (value) {
                    value.release();
                }
            });
            this._elements = void 0;
        };
        NumberIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        NumberIUnknownMap.prototype.get = function (key) {
            var element = this.getWeakRef(key);
            if (element) {
                element.addRef();
            }
            return element;
        };
        NumberIUnknownMap.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        NumberIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        NumberIUnknownMap.prototype.putWeakRef = function (key, value) {
            var elements = this._elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        NumberIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                var value = this._elements[key];
                callback(key, value);
            }
        };
        Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
            get: function () {
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
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberIUnknownMap;
});
