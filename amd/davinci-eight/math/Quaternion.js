define(["require", "exports"], function (require, exports) {
    var Quaternion = (function () {
        function Quaternion(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return Quaternion;
    })();
    return Quaternion;
});
