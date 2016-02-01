define(["require", "exports"], function (require, exports) {
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeZX;
});
