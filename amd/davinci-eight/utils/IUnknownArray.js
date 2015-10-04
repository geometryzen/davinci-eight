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
        function IUnknownArray(elements) {
            if (elements === void 0) { elements = []; }
            _super.call(this, LOGGING_NAME);
            this._elements = elements;
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].addRef();
            }
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
         * Gets the element at the specified index, incrementing the reference count.
         * @method get
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.get = function (index) {
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
        IUnknownArray.prototype.slice = function (start, end) {
            return new IUnknownArray(this._elements.slice(start, end));
        };
        /**
         * @method splice
         * @param index {number}
         * @param count {number}
         * @return {IUnnownArray<T>}
         */
        IUnknownArray.prototype.splice = function (index, count) {
            // The release burdon is on the caller now.
            // FIXME: This should return another IUnknownArray
            return new IUnknownArray(this._elements.splice(index, count));
        };
        /**
         * @method shift
         * @return {T}
         */
        IUnknownArray.prototype.shift = function () {
            // No need to addRef because ownership is being transferred to caller.
            return this._elements.shift();
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
         * Pushes an element onto the tail of the list and increments the element reference count.
         * @method push
         * @param element {T}
         * @return {number}
         */
        IUnknownArray.prototype.push = function (element) {
            var x = this._elements.push(element);
            if (element) {
                element.addRef();
            }
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
