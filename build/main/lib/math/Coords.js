"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var VectorN_1 = require("./VectorN");
/**
 *
 */
var Coords = (function (_super) {
    tslib_1.__extends(Coords, _super);
    /**
     *
     */
    function Coords(coords, modified, size) {
        return _super.call(this, coords, modified, size) || this;
    }
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate to zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    Coords.prototype.approx = function (n) {
        var max = 0;
        var coords = this.coords;
        var iLen = coords.length;
        for (var i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        var threshold = max * Math.pow(10, -n);
        for (var i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    };
    /**
     *
     */
    Coords.prototype.equals = function (other) {
        if (other instanceof Coords) {
            var iLen = this.coords.length;
            for (var i = 0; i < iLen; i++) {
                if (this.coords[i] !== other.coords[i]) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    };
    return Coords;
}(VectorN_1.VectorN));
exports.Coords = Coords;
