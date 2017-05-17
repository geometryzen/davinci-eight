"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeDefined_1 = require("../checks/mustBeDefined");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
function vLightRequired(attributes, uniforms) {
    mustBeDefined_1.mustBeDefined('attributes', attributes);
    mustBeDefined_1.mustBeDefined('uniforms', uniforms);
    return !!uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}
exports.vLightRequired = vLightRequired;
