"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeInteger_1 = require("../checks/mustBeInteger");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
/**
 *
 */
var PointSizeFacet = /** @class */ (function () {
    /**
     *
     */
    function PointSizeFacet(pointSize) {
        if (pointSize === void 0) { pointSize = 2; }
        this.pointSize = mustBeInteger_1.mustBeInteger('pointSize', pointSize);
    }
    /**
     *
     */
    PointSizeFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize);
    };
    return PointSizeFacet;
}());
exports.PointSizeFacet = PointSizeFacet;
