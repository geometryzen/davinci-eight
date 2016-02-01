define(["require", "exports", '../checks/mustBeDefined', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeDefined_1, GraphicsProgramSymbols_1) {
    function vLightRequired(attributes, uniforms) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        return !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vLightRequired;
});
