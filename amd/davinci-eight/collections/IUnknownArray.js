var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable_1) {
    function transferOwnership(data) {
        if (data) {
            var result = new IUnknownArray(data);
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
    var IUnknownArray = (function (_super) {
        __extends(IUnknownArray, _super);
        function IUnknownArray(elements) {
            if (elements === void 0) { elements = []; }
            _super.call(this, 'IUnknownArray');
            this._elements = elements;
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].addRef();
            }
        }
        IUnknownArray.prototype.destructor = function () {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
            _super.prototype.destructor.call(this);
        };
        IUnknownArray.prototype.get = function (index) {
            var element = this.getWeakRef(index);
            if (element) {
                element.addRef();
            }
            return element;
        };
        IUnknownArray.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        IUnknownArray.prototype.indexOf = function (searchElement, fromIndex) {
            return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(IUnknownArray.prototype, "length", {
            get: function () {
                if (this._elements) {
                    return this._elements.length;
                }
                else {
                    console.warn("IUnknownArray is now a zombie, length is undefined");
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        IUnknownArray.prototype.slice = function (begin, end) {
            return new IUnknownArray(this._elements.slice(begin, end));
        };
        IUnknownArray.prototype.splice = function (index, deleteCount) {
            return transferOwnership(this._elements.splice(index, deleteCount));
        };
        IUnknownArray.prototype.shift = function () {
            return this._elements.shift();
        };
        IUnknownArray.prototype.forEach = function (callback) {
            return this._elements.forEach(callback);
        };
        IUnknownArray.prototype.push = function (element) {
            if (element) {
                element.addRef();
            }
            return this.pushWeakRef(element);
        };
        IUnknownArray.prototype.pushWeakRef = function (element) {
            return this._elements.push(element);
        };
        IUnknownArray.prototype.pop = function () {
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
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IUnknownArray;
});
