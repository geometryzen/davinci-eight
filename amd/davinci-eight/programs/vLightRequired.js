define(["require", "exports", '../checks/mustBeDefined', '../core/Symbolic'], function (require, exports, mustBeDefined, Symbolic) {
    function vLightRequired(attributes, uniforms) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    return vLightRequired;
});
