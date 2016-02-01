define(["require", "exports"], function (require, exports) {
    function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
        return ax * bx + ay * by + az * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorCartesianE3;
});
