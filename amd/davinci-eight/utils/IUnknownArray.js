var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    var LOGGING_NAME = 'IUnknownArray';
    /**
     * @class IUnknownArray
     */
    var IUnknownArray = (function (_super) {
        __extends(IUnknownArray, _super);
        /**
         * Collection class for maintaining an array of types derived from IUnknown.
         * Provides a safer way to maintain reference counts than a native array.
         * @class IUnknownArray
         * @constructor
         */
        function IUnknownArray() {
            _super.call(this, LOGGING_NAME);
            this._elements = [];
        }
        /**
         * @method destructor
         * @return {void}
         */
        IUnknownArray.prototype.destructor = function () {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
        };
        /**
         * Gets the element at the specified index without incrementing the reference count.
         * Use this method when you don't intend to hold onto the returned value.
         * @method getWeakReference
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.getWeakReference = function (index) {
            return this._elements[index];
        };
        /**
         * Gets the element at the specified index, incrementing the reference count.
         * Use this method when you intend to hold onto the referent and release it later.
         * @method getStrongReference
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.getStrongReference = function (index) {
            var element;
            element = this._elements[index];
            if (element) {
                element.addRef();
            }
            return element;
        };
        /**
         * @method indexOf
         * @param searchElement {T}
         * @param [fromIndex]
         * @return {number}
         */
        IUnknownArray.prototype.indexOf = function (searchElement, fromIndex) {
            return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(IUnknownArray.prototype, "length", {
            /**
             * @property length
             * @return {number}
             */
            get: function () {
                return this._elements.length;
            },
            enumerable: true,
            configurable: true
        });
        IUnknownArray.prototype.splice = function (index, count) {
            // The release burdon is on the caller now.
            // FIXME: This should return another IUnknownArray
            return this._elements.splice(index, count);
        };
        /**
         * Traverse without Reference Counting
         * @method forEach
         * @param callback {(value: T, index: number)=>void}
         * @return {void}
         */
        IUnknownArray.prototype.forEach = function (callback) {
            return this._elements.forEach(callback);
        };
        /**
         * @method push
         * @param element {T}
         * @return {number}
         */
        IUnknownArray.prototype.push = function (element) {
            var x = this._elements.push(element);
            element.addRef();
            return x;
        };
        /**
         * @method pop
         * @return {T}
         */
        IUnknownArray.prototype.pop = function () {
            // No need to addRef because ownership is being transferred to caller.
            return this._elements.pop();
        };
        return IUnknownArray;
    })(Shareable);
    return IUnknownArray;
});
