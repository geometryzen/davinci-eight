"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vCoordsRequired = void 0;
var mustBeDefined_1 = require("../checks/mustBeDefined");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
function vCoordsRequired(attributes, uniforms) {
    mustBeDefined_1.mustBeDefined('attributes', attributes);
    mustBeDefined_1.mustBeDefined('uniforms', uniforms);
    return !!attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS];
}
exports.vCoordsRequired = vCoordsRequired;
