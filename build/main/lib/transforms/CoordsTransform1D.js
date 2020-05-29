"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordsTransform1D = void 0;
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var Vector1_1 = require("../math/Vector1");
/**
 * Applies coordinates to a line.
 */
var CoordsTransform1D = /** @class */ (function () {
    function CoordsTransform1D(flipU) {
        this.flipU = mustBeBoolean_1.mustBeBoolean('flipU', flipU);
    }
    CoordsTransform1D.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var u = i / (iLength - 1);
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector1_1.Vector1([u]);
    };
    return CoordsTransform1D;
}());
exports.CoordsTransform1D = CoordsTransform1D;
