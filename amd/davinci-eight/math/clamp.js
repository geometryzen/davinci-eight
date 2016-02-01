define(["require", "exports", '../checks/mustBeNumber'], function (require, exports, mustBeNumber_1) {
    function clamp(x, min, max) {
        mustBeNumber_1.default('x', x);
        mustBeNumber_1.default('min', min);
        mustBeNumber_1.default('max', max);
        return (x < min) ? min : ((x > max) ? max : x);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = clamp;
});
