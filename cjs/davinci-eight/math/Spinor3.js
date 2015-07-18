/**
 * @class Spinor3
 */
var Spinor3 = (function () {
    function Spinor3(spinor) {
        this.yz = spinor ? spinor.yz : 0;
        this.zx = spinor ? spinor.zx : 0;
        this.xy = spinor ? spinor.xy : 0;
        this.w = spinor ? spinor.w : 1;
    }
    Spinor3.prototype.clone = function () {
        return new Spinor3({ yz: this.yz, zx: this.zx, xy: this.xy, w: this.w });
    };
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    Spinor3.prototype.toString = function () {
        return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
    };
    return Spinor3;
})();
module.exports = Spinor3;
