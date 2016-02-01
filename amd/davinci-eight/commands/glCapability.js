define(["require", "exports", '../commands/Capability', '../checks/isDefined', '../checks/mustBeDefined', '../checks/mustBeInteger'], function (require, exports, Capability_1, isDefined_1, mustBeDefined_1, mustBeInteger_1) {
    function glCapability(capability, gl) {
        if (isDefined_1.default(capability)) {
            mustBeInteger_1.default('capability', capability);
            mustBeDefined_1.default('gl', gl);
            switch (capability) {
                case Capability_1.default.BLEND: return gl.BLEND;
                case Capability_1.default.CULL_FACE: return gl.CULL_FACE;
                case Capability_1.default.DEPTH_TEST: return gl.DEPTH_TEST;
                case Capability_1.default.POLYGON_OFFSET_FILL: return gl.POLYGON_OFFSET_FILL;
                case Capability_1.default.SCISSOR_TEST: return gl.SCISSOR_TEST;
                default: {
                    throw new Error(capability + " is not a valid capability.");
                }
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = glCapability;
});
