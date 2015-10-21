var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeString, Shareable) {
    /**
     * @class StringIUnknownMap
     * @extends Shareable
     */
    var StringIUnknownMap = (function (_super) {
        __extends(StringIUnknownMap, _super);
        /**
         * <p>
         * A map of <code>string</code> to <code>V extends IUnknown</code>.
         * </p>
         * @class StringIUnknownMap
         * @constructor
         */
        function StringIUnknownMap() {
            _super.call(this, 'StringIUnknownMap');
            /**
             * @property elements
             * @type {{[key: string]: V}}
             */
            this.elements = {};
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        StringIUnknownMap.prototype.destructor = function () {
            var self = this;
            this.forEach(function (key) {
                self.putWeakRef(key, void 0);
            });
            _super.prototype.destructor.call(this);
        };
        /**
         * Determines whether the key exists in the map with a defined value.
         * @method exists
         * @param key {string}
         * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
         */
        StringIUnknownMap.prototype.exists = function (key) {
            var element = this.elements[key];
            return element ? true : false;
        };
        /**
         * @method get
         * @param key {string}
         * @return {V}
         */
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
        /**
         * @method getWeakRef
         * @param key {string}
         * @return {V}
         */
        StringIUnknownMap.prototype.getWeakRef = function (key) {
            return this.elements[key];
        };
        /**
         * @method put
         * @param key {string}
         * @param value {V}
         * @return {void}
         */
        StringIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        /**
         * @method putWeakRef
         * @param key {string}
         * @param value {V}
         * @return {void}
         */
        StringIUnknownMap.prototype.putWeakRef = function (key, value) {
            mustBeString('key', key);
            var elements = this.elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        /**
         * @method forEach
         * @param callback {(key: string, value: V) => void}
         */
        StringIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                callback(key, this.elements[key]);
            }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
            /**
             * @property keys
             * @type {string[]}
             */
            get: function () {
                return Object.keys(this.elements);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
            /**
             * @property values
             * @type {V[]}
             */
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
        /**
         * @method remove
         * @param key {string}
         * @return {V}
         */
        StringIUnknownMap.prototype.remove = function (key) {
            mustBeString('key', key);
            var value = this.elements[key];
            delete this.elements[key];
            return value;
        };
        return StringIUnknownMap;
    })(Shareable);
    return StringIUnknownMap;
});
