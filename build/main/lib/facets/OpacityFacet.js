"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeLE_1 = require("../checks/mustBeLE");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
/**
 *
 */
var OpacityFacet = (function () {
    /**
     *
     */
    function OpacityFacet(opacity) {
        if (opacity === void 0) { opacity = 1; }
        mustBeNumber_1.mustBeNumber('opacity', opacity);
        mustBeGE_1.mustBeGE('opacity', opacity, 0);
        mustBeLE_1.mustBeLE('opacity', opacity, 1);
        this.opacity = opacity;
    }
    /**
     *
     */
    OpacityFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY, this.opacity);
    };
    return OpacityFacet;
}());
exports.OpacityFacet = OpacityFacet;
