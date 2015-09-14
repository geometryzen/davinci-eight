var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
var LOGGING_NAME_IUNKNOWN_MAP = 'IUnknownMap';
var IUnknownMap = (function () {
    function IUnknownMap() {
        this._refCount = 1;
        this._elements = {};
        this._uuid = uuid4().generate();
        refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
    }
    IUnknownMap.prototype.addRef = function () {
        refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
        this._refCount++;
        return this._refCount;
    };
    IUnknownMap.prototype.release = function () {
        refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, -1);
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
    IUnknownMap.prototype.exists = function (key) {
        var element = this._elements[key];
        return element ? true : false;
    };
    IUnknownMap.prototype.get = function (key) {
        var element = this._elements[key];
        if (element) {
            element.addRef();
            return element;
        }
        else {
            return void 0;
        }
    };
    IUnknownMap.prototype.put = function (key, value) {
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
    IUnknownMap.prototype.forEach = function (callback) {
        var keys = this.keys;
        var i;
        var length = keys.length;
        for (i = 0; i < length; i++) {
            var key = keys[i];
            callback(key);
        }
    };
    Object.defineProperty(IUnknownMap.prototype, "keys", {
        get: function () {
            // TODO: memoize
            return Object.keys(this._elements);
        },
        enumerable: true,
        configurable: true
    });
    IUnknownMap.prototype.remove = function (key) {
        this.put(key, void 0);
        delete this._elements[key];
    };
    return IUnknownMap;
})();
module.exports = IUnknownMap;
