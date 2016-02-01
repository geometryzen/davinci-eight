define(["require", "exports"], function (require, exports) {
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeXY;
});
