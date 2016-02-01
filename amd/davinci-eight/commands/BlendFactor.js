define(["require", "exports"], function (require, exports) {
    var BlendFactor;
    (function (BlendFactor) {
        BlendFactor[BlendFactor["DST_ALPHA"] = 0] = "DST_ALPHA";
        BlendFactor[BlendFactor["DST_COLOR"] = 1] = "DST_COLOR";
        BlendFactor[BlendFactor["ONE"] = 2] = "ONE";
        BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 3] = "ONE_MINUS_DST_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 4] = "ONE_MINUS_DST_COLOR";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 5] = "ONE_MINUS_SRC_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 6] = "ONE_MINUS_SRC_COLOR";
        BlendFactor[BlendFactor["SRC_ALPHA"] = 7] = "SRC_ALPHA";
        BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 8] = "SRC_ALPHA_SATURATE";
        BlendFactor[BlendFactor["SRC_COLOR"] = 9] = "SRC_COLOR";
        BlendFactor[BlendFactor["ZERO"] = 10] = "ZERO";
    })(BlendFactor || (BlendFactor = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BlendFactor;
});
