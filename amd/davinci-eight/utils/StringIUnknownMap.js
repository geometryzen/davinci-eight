define(["require", "exports", '../utils/refChange', '../utils/uuid4'], function (require, exports, refChange, uuid4) {
    function className(user) {
        var LOGGING_NAME_IUNKNOWN_MAP = 'StringIUnknownMap';
        return LOGGING_NAME_IUNKNOWN_MAP + ":" + user;
    }
    /**
     * @class StringIUnknownMap<V extends IUnknown>
     * @extends IUnknown
     */
    // FIXME: Extend Shareable
    var StringIUnknownMap = (function () {
        /**
         * <p>
         * A map&lt;V&gt; of <code>string</code> to <code>V extends IUnknown</code>.
         * </p>
         * @class StringIUnknownMap
         * @constructor
         */
        function StringIUnknownMap(userName) {
            this._refCount = 1;
            this._elements = {};
            this._uuid = uuid4().generate();
            this._userName = userName;
            refChange(this._uuid, className(this._userName), +1);
        }
        StringIUnknownMap.prototype.addRef = function () {
            refChange(this._uuid, className(this._userName), +1);
            this._refCount++;
            return this._refCount;
        };
        StringIUnknownMap.prototype.release = function () {
            refChange(this._uuid, className(this._userName), -1);
            this._refCount--;
            if (this._refCount === 0) {
                var self_1 = this;
                this.forEach(function (key) {
                    self_1.putWeakReference(key, void 0);
                });
                this._elements = void 0;
            }
            return this._refCount;
        };
        /**
         * Determines whether the key exists in the map with a defined value.
         * @method exists
         * @param key {string}
         * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
         */
        StringIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        StringIUnknownMap.prototype.get = function (key) {
            var element = this._elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        StringIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakReference(key, value);
        };
        /**
         * @method putWeakReference
         * @param key {string}
         * @param value {V}
         * @return {void}
         * @private
         */
        StringIUnknownMap.prototype.putWeakReference = function (key, value) {
            var elements = this._elements;
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
                callback(key, this._elements[key]);
            }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
            get: function () {
                // TODO: Cache
                return Object.keys(this._elements);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
            get: function () {
                // TODO: Cache
                var values = [];
                var keys = this.keys;
                for (var i = 0, iLength = keys.length; i < iLength; i++) {
                    var key = keys[i];
                    values.push(this._elements[key]);
                }
                return values;
            },
            enumerable: true,
            configurable: true
        });
        StringIUnknownMap.prototype.remove = function (key) {
            var value = this._elements[key];
            if (value) {
                value.release();
            }
            delete this._elements[key];
        };
        return StringIUnknownMap;
    })();
    return StringIUnknownMap;
});
