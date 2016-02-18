define(["require", "exports", '../math/G2m', '../math/G3m', '../math/R2m', '../math/R3m'], function (require, exports, G2m_1, G3m_1, R2m_1, R3m_1) {
    function dataLength(source) {
        if (source instanceof G3m_1.default) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof G2m_1.default) {
            if (source.length !== 4) {
                throw new Error("source.length is expected to be 4");
            }
            return 2;
        }
        else if (source instanceof R3m_1.default) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof R2m_1.default) {
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
