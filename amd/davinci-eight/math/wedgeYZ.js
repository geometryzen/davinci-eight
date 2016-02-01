define(["require", "exports"], function (require, exports) {
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeYZ;
});
