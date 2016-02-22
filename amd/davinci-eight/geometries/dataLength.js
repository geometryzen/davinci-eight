define(["require", "exports", '../math/Geometric2', '../math/Geometric3', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    function dataLength(source) {
        if (source instanceof Geometric3_1.default) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof Geometric2_1.default) {
            if (source.length !== 4) {
                throw new Error("source.length is expected to be 4");
            }
            return 2;
        }
        else if (source instanceof Vector3_1.default) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof Vector2_1.default) {
            if (source.length !== 2) {
                throw new Error("source.length is expected to be 2");
            }
            return 2;
        }
        else {
            return source.length;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dataLength;
});
