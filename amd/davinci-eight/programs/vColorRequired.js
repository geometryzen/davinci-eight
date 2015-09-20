define(["require", "exports", '../core/Symbolic'], function (require, exports, Symbolic) {
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    return vColorRequired;
});
