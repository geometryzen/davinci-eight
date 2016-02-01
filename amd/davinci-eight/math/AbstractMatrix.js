define(["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/expectArg', '../i18n/readOnly'], function (require, exports, mustBeDefined_1, mustBeInteger_1, expectArg_1, readOnly_1) {
    var AbstractMatrix = (function () {
        function AbstractMatrix(elements, dimensions) {
            this._elements = mustBeDefined_1.default('elements', elements);
            this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            get: function () {
                if (this._elements) {
                    return this._elements;
                }
                else if (this._callback) {
                    var elements = this._callback();
                    expectArg_1.default('callback()', elements).toSatisfy(elements.length === this._length, "callback() length must be " + this._length);
                    return this._callback();
                }
                else {
                    throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
                }
            },
            set: function (elements) {
                expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                this._elements = elements;
                this._callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._elements = void 0;
            },
            enumerable: true,
            configurable: true
        });
        AbstractMatrix.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            get: function () {
                return this._dimensions;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('dimensions').message);
            },
            enumerable: true,
            configurable: true
        });
        return AbstractMatrix;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractMatrix;
});
