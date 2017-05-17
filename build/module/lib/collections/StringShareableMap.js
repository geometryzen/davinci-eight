import * as tslib_1 from "tslib";
import { ShareableBase } from '../core/ShareableBase';
/**
 *
 */
var StringShareableMap = (function (_super) {
    tslib_1.__extends(StringShareableMap, _super);
    /**
     * A map of string to V extends Shareable.
     */
    function StringShareableMap() {
        var _this = _super.call(this) || this;
        _this.elements = {};
        _this.setLoggingName('StringShareableMap');
        return _this;
    }
    StringShareableMap.prototype.destructor = function (levelUp) {
        var _this = this;
        this.forEach(function (key) {
            _this.putWeakRef(key, void 0);
        });
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * Determines whether the key exists in the map with a defined value.
     */
    StringShareableMap.prototype.exists = function (key) {
        var element = this.elements[key];
        return element ? true : false;
    };
    StringShareableMap.prototype.get = function (key) {
        var element = this.elements[key];
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
            return element;
        }
        else {
            return void 0;
        }
    };
    StringShareableMap.prototype.getWeakRef = function (key) {
        return this.elements[key];
    };
    StringShareableMap.prototype.put = function (key, value) {
        if (value && value.addRef) {
            value.addRef();
        }
        this.putWeakRef(key, value);
    };
    StringShareableMap.prototype.putWeakRef = function (key, value) {
        var elements = this.elements;
        var existing = elements[key];
        if (existing) {
            if (existing.release) {
                existing.release();
            }
        }
        elements[key] = value;
    };
    StringShareableMap.prototype.forEach = function (callback) {
        var keys = this.keys;
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            callback(key, this.elements[key]);
        }
    };
    Object.defineProperty(StringShareableMap.prototype, "keys", {
        get: function () {
            return Object.keys(this.elements);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StringShareableMap.prototype, "values", {
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
    StringShareableMap.prototype.remove = function (key) {
        var value = this.elements[key];
        delete this.elements[key];
        return value;
    };
    return StringShareableMap;
}(ShareableBase));
export { StringShareableMap };
