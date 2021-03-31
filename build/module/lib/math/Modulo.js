import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
/**
 * Modulo Arithmetic (Experimental).
 * @hidden
 */
var Modulo = /** @class */ (function () {
    function Modulo() {
        this._value = 0;
        this._size = 0;
    }
    Object.defineProperty(Modulo.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            mustBeInteger('size', size);
            mustBeGE('size', size, 0);
            this._size = size;
            this.value = this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Modulo.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value % this._size;
        },
        enumerable: false,
        configurable: true
    });
    Modulo.prototype.inc = function () {
        this._value++;
        if (this._value === this._size) {
            this._value = 0;
        }
        return this._value;
    };
    return Modulo;
}());
export { Modulo };
