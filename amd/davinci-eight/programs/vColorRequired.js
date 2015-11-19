define(["require", "exports", '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgramSymbols) {
    function vColorRequired(attributes, uniforms) {
        return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
    }
    return vColorRequired;
});
