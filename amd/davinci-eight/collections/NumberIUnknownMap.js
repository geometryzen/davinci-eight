var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    // FIXME: Maybe use a dynamic flag implying JIT keys, otherwise recompute as we go along.
    var LOGGING_NAME = 'NumberIUnknownMap';
    /**
     * @class NumberIUnknownMap&lt;V extends IUnknown&gt;
     * @extends Shareable
     */
    var NumberIUnknownMap = (function (_super) {
        __extends(NumberIUnknownMap, _super);
        /**
         * @class NumberIUnknownMap&lt;V extends IUnknown&gt;
         * @constructor
         */
        function NumberIUnknownMap() {
            _super.call(this, LOGGING_NAME);
            /**
             * @property _elements
             * @private
             */
            this._elements = {};
        }
        /**
         * @property destructor
         * @return {void}
         * @protected
         */
        NumberIUnknownMap.prototype.destructor = function () {
            var self = this;
            this.forEach(function (key, value) {
                if (value) {
                    value.release();
                }
            });
            this._elements = void 0;
        };
        /**
         * @method exists
         * @param {number}
         * @return {boolean}
         */
        NumberIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        /**
         * @method get
         * @param key {number}
         * @return {V}
         */
        NumberIUnknownMap.prototype.get = function (key) {
            var element = this.getWeakRef(key);
            if (element) {
                element.addRef();
            }
            return element;
        };
        /**
         * @method getWeakRef
         * @param key {number}
         * @return {V}
         */
        NumberIUnknownMap.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        /**
         * @method put
         * @param key {number}
         * @param value {V}
         * @return {void}
         */
        NumberIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        /**
         * @method putWeakRef
         * @param key {number}
         * @param value {V}
         * @return {void}
         */
        NumberIUnknownMap.prototype.putWeakRef = function (key, value) {
            var elements = this._elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        /**
         * @method forEach
         * @param callback {(key: number, value: V) => void}
         * @return {void}
         */
        NumberIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                var value = this._elements[key];
                callback(key, value);
            }
        };
        Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
            /**
             * @property keys
             * @type {number[]}
             */
            get: function () {
                // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
                return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method remove
         * @param key {number}
         * @return {void}
         */
        NumberIUnknownMap.prototype.remove = function (key) {
            // Strong or Weak doesn't matter because the value is `undefined`.
            this.put(key, void 0);
            delete this._elements[key];
        };
        return NumberIUnknownMap;
    })(Shareable);
    return NumberIUnknownMap;
});
