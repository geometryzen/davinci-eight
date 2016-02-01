define(["require", "exports", '../math/G2', '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G2_1, G3_1, R2_1, R3_1) {
    function dataLength(source) {
        if (source instanceof G3_1.default) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof G2_1.default) {
            if (source.length !== 4) {
                throw new Error("source.length is expected to be 4");
            }
            return 2;
        }
        else if (source instanceof R3_1.default) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof R2_1.default) {
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
