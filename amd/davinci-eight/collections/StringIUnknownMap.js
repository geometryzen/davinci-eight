var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Shareable'], function (require, exports, Shareable_1) {
    var StringIUnknownMap = (function (_super) {
        __extends(StringIUnknownMap, _super);
        function StringIUnknownMap() {
            _super.call(this, 'StringIUnknownMap');
            this.elements = {};
        }
        StringIUnknownMap.prototype.destructor = function () {
            var _this = this;
            this.forEach(function (key) {
                _this.putWeakRef(key, void 0);
            });
            _super.prototype.destructor.call(this);
        };
        StringIUnknownMap.prototype.exists = function (key) {
            var element = this.elements[key];
            return element ? true : false;
        };
        StringIUnknownMap.prototype.get = function (key) {
            var element = this.elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        StringIUnknownMap.prototype.getWeakRef = function (key) {
            return this.elements[key];
        };
        StringIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        StringIUnknownMap.prototype.putWeakRef = function (key, value) {
            var elements = this.elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        StringIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                callback(key, this.elements[key]);
            }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
            get: function () {
                return Object.keys(this.elements);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
            get: function () {
                var values = [];
                var keys = this.keys;
                for (var i = 0, iLength = keys.length; i < iLength; i++) {
                    var key = keys[i];
                    values.push(this.elements[key]);
                }
                return values;
            },
            enumerable: true,
            configurable: true
        });
        StringIUnknownMap.prototype.remove = function (key) {
            var value = this.elements[key];
            delete this.elements[key];
            return value;
        };
        return StringIUnknownMap;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StringIUnknownMap;
});
