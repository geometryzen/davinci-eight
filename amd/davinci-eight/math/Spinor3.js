define(["require", "exports"], function (require, exports) {
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
        return Spinor3;
    })();
    return Spinor3;
});
