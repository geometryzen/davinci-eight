define(["require", "exports", '../math/Geometric2', '../math/Geometric3', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    function dataFromVectorN(source) {
        if (source instanceof Geometric3_1.default) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof Geometric2_1.default) {
            var g2 = source;
            return [g2.x, g2.y];
        }
        else if (source instanceof Vector3_1.default) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof Vector2_1.default) {
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
