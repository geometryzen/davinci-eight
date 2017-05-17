import * as tslib_1 from "tslib";
import { readOnly } from '../i18n/readOnly';
import { ShareableBase } from '../core/ShareableBase';
/**
 * Essentially constructs the ShareableArray without incrementing the
 * reference count of the elements, and without creating zombies.
 */
function transferOwnership(data) {
    if (data) {
        var result = new ShareableArray(data);
        // The result has now taken ownership of the elements, so we can release.
        for (var i = 0, iLength = data.length; i < iLength; i++) {
            var element = data[i];
            if (element && element.release) {
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
 * <p>
 * Collection class for maintaining an array of types derived from Shareable.
 * </p>
 * <p>
 * Provides a safer way to maintain reference counts than a native array.
 * </p>
 */
var ShareableArray = (function (_super) {
    tslib_1.__extends(ShareableArray, _super);
    /**
     *
     */
    function ShareableArray(elements) {
        if (elements === void 0) { elements = []; }
        var _this = _super.call(this) || this;
        _this.setLoggingName('ShareableArray');
        _this._elements = elements;
        for (var i = 0, l = _this._elements.length; i < l; i++) {
            var element = _this._elements[i];
            if (element.addRef) {
                element.addRef();
            }
        }
        return _this;
    }
    /**
     *
     */
    ShareableArray.prototype.destructor = function (levelUp) {
        for (var i = 0, l = this._elements.length; i < l; i++) {
            var element = this._elements[i];
            if (element.release) {
                element.release();
            }
        }
        this._elements = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    ShareableArray.prototype.find = function (match) {
        var result = new ShareableArray([]);
        var elements = this._elements;
        var iLen = elements.length;
        for (var i = 0; i < iLen; i++) {
            var candidate = elements[i];
            if (match(candidate)) {
                result.push(candidate);
            }
        }
        return result;
    };
    /**
     *
     */
    ShareableArray.prototype.findOne = function (match) {
        var elements = this._elements;
        for (var i = 0, iLength = elements.length; i < iLength; i++) {
            var candidate = elements[i];
            if (match(candidate)) {
                if (candidate.addRef) {
                    candidate.addRef();
                }
                return candidate;
            }
        }
        return void 0;
    };
    /**
     * Gets the element at the specified index, incrementing the reference count.
     */
    ShareableArray.prototype.get = function (index) {
        var element = this.getWeakRef(index);
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
        }
        return element;
    };
    /**
     * Gets the element at the specified index, without incrementing the reference count.
     */
    ShareableArray.prototype.getWeakRef = function (index) {
        return this._elements[index];
    };
    /**
     *
     */
    ShareableArray.prototype.indexOf = function (searchElement, fromIndex) {
        return this._elements.indexOf(searchElement, fromIndex);
    };
    Object.defineProperty(ShareableArray.prototype, "length", {
        /**
         *
         */
        get: function () {
            if (this._elements) {
                return this._elements.length;
            }
            else {
                console.warn("ShareableArray is now a zombie, length is undefined");
                return void 0;
            }
        },
        set: function (unused) {
            throw new Error(readOnly('length').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The slice() method returns a shallow copy of a portion of an array into a new array object.
     *
     * It does not remove elements from the original array.
     */
    ShareableArray.prototype.slice = function (begin, end) {
        return new ShareableArray(this._elements.slice(begin, end));
    };
    /**
     * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
     */
    ShareableArray.prototype.splice = function (index, deleteCount) {
        // The release burdon is on the caller now.
        return transferOwnership(this._elements.splice(index, deleteCount));
    };
    /**
     *
     */
    ShareableArray.prototype.shift = function () {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.shift();
    };
    /**
     * Traverse without Reference Counting
     */
    ShareableArray.prototype.forEach = function (callback) {
        return this._elements.forEach(callback);
    };
    /**
     * Pushes <code>element</code> onto the tail of the list and increments the element reference count.
     */
    ShareableArray.prototype.push = function (element) {
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
        }
        return this.pushWeakRef(element);
    };
    /**
     * Pushes <code>element</code> onto the tail of the list <em>without</em> incrementing the <code>element</code> reference count.
     */
    ShareableArray.prototype.pushWeakRef = function (element) {
        return this._elements.push(element);
    };
    /**
     *
     */
    ShareableArray.prototype.pop = function () {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.pop();
    };
    /**
     *
     */
    ShareableArray.prototype.unshift = function (element) {
        if (element.addRef) {
            element.addRef();
        }
        return this.unshiftWeakRef(element);
    };
    /**
     * <p>
     * <code>unshift</code> <em>without</em> incrementing the <code>element</code> reference count.
     * </p>
     */
    ShareableArray.prototype.unshiftWeakRef = function (element) {
        return this._elements.unshift(element);
    };
    return ShareableArray;
}(ShareableBase));
export { ShareableArray };
