import { __extends } from "tslib";
import { ShareableBase } from '../core/ShareableBase';
var NumberShareableMap = /** @class */ (function (_super) {
    __extends(NumberShareableMap, _super);
    function NumberShareableMap() {
        var _this = _super.call(this) || this;
        _this._elements = {};
        _this.setLoggingName('NumberShareableMap');
        return _this;
    }
    NumberShareableMap.prototype.destructor = function (levelUp) {
        this.forEach(function (key, value) {
            if (value) {
                value.release();
            }
        });
        this._elements = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    NumberShareableMap.prototype.exists = function (key) {
        var element = this._elements[key];
        return element ? true : false;
    };
    NumberShareableMap.prototype.get = function (key) {
        var element = this.getWeakRef(key);
        if (element) {
            element.addRef();
        }
        return element;
    };
    NumberShareableMap.prototype.getWeakRef = function (index) {
        return this._elements[index];
    };
    NumberShareableMap.prototype.put = function (key, value) {
        if (value) {
            value.addRef();
        }
        this.putWeakRef(key, value);
    };
    NumberShareableMap.prototype.putWeakRef = function (key, value) {
        var elements = this._elements;
        var existing = elements[key];
        if (existing) {
            existing.release();
        }
        elements[key] = value;
    };
    NumberShareableMap.prototype.forEach = function (callback) {
        var keys = this.keys;
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var value = this._elements[key];
            callback(key, value);
        }
    };
    Object.defineProperty(NumberShareableMap.prototype, "keys", {
        get: function () {
            // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
            return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
        },
        enumerable: false,
        configurable: true
    });
    NumberShareableMap.prototype.remove = function (key) {
        // Strong or Weak doesn't matter because the value is `undefined`.
        this.put(key, void 0);
        delete this._elements[key];
    };
    return NumberShareableMap;
}(ShareableBase));
export { NumberShareableMap };
