define(["require", "exports", '../math/G2', '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G2_1, G3_1, R2_1, R3_1) {
    function dataFromVectorN(source) {
        if (source instanceof G3_1.default) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof G2_1.default) {
            var g2 = source;
            return [g2.x, g2.y];
        }
        else if (source instanceof R3_1.default) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof R2_1.default) {
            var v2 = source;
            return [v2.x, v2.y];
        }
        else {
            return source.coords;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dataFromVectorN;
});
