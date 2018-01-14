"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var Vector2_1 = require("../math/Vector2");
/**
 * Applies coordinates to a surface.
 */
var CoordsTransform2D = /** @class */ (function () {
    function CoordsTransform2D(flipU, flipV, exchangeUV) {
        this.flipU = mustBeBoolean_1.mustBeBoolean('flipU', flipU);
        this.flipV = mustBeBoolean_1.mustBeBoolean('flipV', flipV);
        this.exchageUV = mustBeBoolean_1.mustBeBoolean('exchangeUV', exchangeUV);
    }
    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    CoordsTransform2D.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var u = i / (iLength - 1);
        var v = j / (jLength - 1);
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2_1.Vector2([u, v]);
    };
    return CoordsTransform2D;
}());
exports.CoordsTransform2D = CoordsTransform2D;
