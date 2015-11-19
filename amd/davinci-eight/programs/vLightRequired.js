define(["require", "exports", '../checks/mustBeDefined', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeDefined, GraphicsProgramSymbols) {
    function vLightRequired(attributes, uniforms) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        return !!uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    return vLightRequired;
});
