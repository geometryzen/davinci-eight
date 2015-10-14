var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    function className(userName) {
        return 'IUnknownArray:' + userName;
    }
    /**
     * Essentially constructs the IUnknownArray without incrementing the
     * reference count of the elements, and without creating zombies.
     */
    function transferOwnership(data, userName) {
        if (data) {
            var result = new IUnknownArray(data, userName);
            // The result has now taken ownership of the elements, so we can release.
            for (var i = 0, iLength = data.length; i < iLength; i++) {
                var element = data[i];
                if (element) {
                    element.release();
                }
            }
            return result;
        }
        else {
            return void 0;
        }
    }
    /**
     * @class IUnknownArray<T extends IUnknown>
     * @extends Shareable
     */
    var IUnknownArray = (function (_super) {
        __extends(IUnknownArray, _super);
        /**
         * Collection class for maintaining an array of types derived from IUnknown.
         * Provides a safer way to maintain reference counts than a native array.
         * @class IUnknownArray
         * @constructor
         */
        function IUnknownArray(elements, userName) {
            if (elements === void 0) { elements = []; }
            _super.call(this, className(userName));
            this._elements = elements;
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].addRef();
            }
            this.userName = userName;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        IUnknownArray.prototype.destructor = function () {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
            // Don't set the userName property to undefined so that we can report zombie calls.
            _super.prototype.destructor.call(this);
        };
        /**
         * Gets the element at the specified index, incrementing the reference count.
         * @method get
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.get = function (index) {
            var element = this.getWeakRef(index);
            if (element) {
                element.addRef();
            }
            return element;
        };
        /**
         * Gets the element at the specified index, without incrementing the reference count.
         * @method getWeakRef
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.getWeakRef = function (index) {
            return this._elements[index];
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
                if (this._elements) {
                    return this._elements.length;
                }
                else {
                    console.warn(className(this.userName) + " is now a zombie, length is undefined");
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The slice() method returns a shallow copy of a portion of an array into a new array object.
         * It does not remove elements from the original array.
         * @method slice
         * @param begin [number]
         * @param end [number]
         */
        IUnknownArray.prototype.slice = function (begin, end) {
            return new IUnknownArray(this._elements.slice(begin, end), 'IUnknownArray.slice()');
        };
        /**
         * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
         * @method splice
         * @param index {number}
         * @param deleteCount {number}
         * @return {IUnkownArray<T>}
         */
        IUnknownArray.prototype.splice = function (index, deleteCount) {
            // The release burdon is on the caller now.
            return transferOwnership(this._elements.splice(index, deleteCount), 'IUnknownArray.slice()');
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
            if (element) {
                element.addRef();
            }
            return this.pushWeakRef(element);
        };
        /**
         * Pushes an element onto the tail of the list without incrementing the element reference count.
         * @method pushWeakRef
         * @param element {T}
         * @return {number}
         */
        IUnknownArray.prototype.pushWeakRef = function (element) {
            return this._elements.push(element);
        };
        /**
         * @method pop
         * @return {T}
         */
        IUnknownArray.prototype.pop = function () {
            // No need to addRef because ownership is being transferred to caller.
            return this._elements.pop();
        };
        IUnknownArray.prototype.unshift = function (element) {
            element.addRef();
            return this.unshiftWeakRef(element);
        };
        IUnknownArray.prototype.unshiftWeakRef = function (element) {
            return this._elements.unshift(element);
        };
        return IUnknownArray;
    })(Shareable);
    return IUnknownArray;
});
