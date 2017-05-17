"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeInteger_1 = require("../checks/mustBeInteger");
/**
 * Modulo Arithmetic (Experimental).
 */
var Modulo = (function () {
    function Modulo() {
        this._value = 0;
        this._size = 0;
    }
    Object.defineProperty(Modulo.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            mustBeInteger_1.mustBeInteger('size', size);
            mustBeGE_1.mustBeGE('size', size, 0);
            this._size = size;
            this.value = this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Modulo.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value % this._size;
        },
        enumerable: true,
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
exports.Modulo = Modulo;
