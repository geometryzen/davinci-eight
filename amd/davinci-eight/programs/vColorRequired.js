define(["require", "exports", '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgramSymbols_1) {
    function vColorRequired(attributes, uniforms) {
        return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vColorRequired;
});
