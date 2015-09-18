var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
var LOGGING_NAME = 'IUnknownArray';
var IUnknownArray = (function () {
    function IUnknownArray() {
        this._elements = [];
        this._refCount = 1;
        this._uuid = uuid4().generate();
        refChange(this._uuid, LOGGING_NAME, +1);
    }
    IUnknownArray.prototype.addRef = function () {
        this._refCount++;
        refChange(this._uuid, LOGGING_NAME, +1);
        return this._refCount;
    };
    IUnknownArray.prototype.indexOf = function (element) {
        return this._elements.indexOf(element);
    };
    Object.defineProperty(IUnknownArray.prototype, "length", {
        get: function () {
            return this._elements.length;
        },
        enumerable: true,
        configurable: true
    });
    IUnknownArray.prototype.release = function () {
        this._refCount--;
        refChange(this._uuid, LOGGING_NAME, -1);
        if (this._refCount === 0) {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
            this._refCount = void 0;
            this._uuid = void 0;
            return 0;
        }
        else {
            return this._refCount;
        }
    };
    IUnknownArray.prototype.splice = function (index, count) {
        // The release burdon is on the caller now.
        return this._elements.splice(index, count);
    };
    /**
     * Traverse without Reference Counting
     */
    IUnknownArray.prototype.forEach = function (callback) {
        this._elements.forEach(callback);
    };
    IUnknownArray.prototype.push = function (element) {
        this._elements.push(element);
        element.addRef();
    };
    IUnknownArray.prototype.pop = function () {
        return this._elements.pop();
    };
    return IUnknownArray;
})();
module.exports = IUnknownArray;
