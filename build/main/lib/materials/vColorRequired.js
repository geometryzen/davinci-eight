"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
function vColorRequired(attributes, uniforms) {
    return !!attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR];
}
exports.vColorRequired = vColorRequired;
