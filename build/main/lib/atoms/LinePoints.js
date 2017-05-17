"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CurvePrimitive_1 = require("./CurvePrimitive");
var BeginMode_1 = require("../core/BeginMode");
var elementsForCurve_1 = require("./elementsForCurve");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeLT_1 = require("../checks/mustBeLT");
/**
 *
 */
var LinePoints = (function (_super) {
    tslib_1.__extends(LinePoints, _super);
    /**
     * @param uSegments
     */
    function LinePoints(uSegments) {
        var _this = _super.call(this, BeginMode_1.BeginMode.POINTS, uSegments, false) || this;
        _this.elements = elementsForCurve_1.elementsForCurve(uSegments, false);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    LinePoints.prototype.vertex = function (uIndex) {
        mustBeInteger_1.mustBeInteger('uIndex', uIndex);
        mustBeGE_1.mustBeGE('uIndex', uIndex, 0);
        mustBeLT_1.mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return LinePoints;
}(CurvePrimitive_1.CurvePrimitive));
exports.LinePoints = LinePoints;
