define(["require", "exports"], function (require, exports) {
    function principalAngle(angle) {
        if (angle > 2 * Math.PI) {
            return principalAngle(angle - 2 * Math.PI);
        }
        else if (angle < 0) {
            return principalAngle(angle + 2 * Math.PI);
        }
        else {
            return angle;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = principalAngle;
});
