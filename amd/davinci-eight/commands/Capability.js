define(["require", "exports"], function (require, exports) {
    var Capability;
    (function (Capability) {
        Capability[Capability["BLEND"] = 0] = "BLEND";
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
    })(Capability || (Capability = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Capability;
});
