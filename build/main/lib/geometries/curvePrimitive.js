"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../core/Color");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var LineStrip_1 = require("../atoms/LineStrip");
var CurveMode_1 = require("./CurveMode");
var LinePoints_1 = require("../atoms/LinePoints");
var isDefined_1 = require("../checks/isDefined");
var isFunction_1 = require("../checks/isFunction");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Vector3_1 = require("../math/Vector3");
function aPositionDefault(u) {
    return Vector3_1.Vector3.vector(u, 0, 0);
}
function topology(mode, uSegments, uClosed) {
    switch (mode) {
        case CurveMode_1.CurveMode.POINTS: {
            return new LinePoints_1.LinePoints(uSegments);
        }
        case CurveMode_1.CurveMode.LINES: {
            return new LineStrip_1.LineStrip(uSegments);
        }
        default: {
            throw new Error("mode must be POINTS or LINES");
        }
    }
}
function transformVertex(vertex, u, options) {
    var aPosition = isDefined_1.isDefined(options.aPosition) ? options.aPosition : aPositionDefault;
    var aColor = isDefined_1.isDefined(options.aColor) ? options.aColor : void 0;
    if (isFunction_1.isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3_1.Vector3.copy(aPosition(u));
    }
    if (isFunction_1.isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color_1.Color.copy(aColor(u));
    }
}
function curvePrimitive(options) {
    var uMin = isDefined_1.isDefined(options.uMin) ? mustBeNumber_1.mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined_1.isDefined(options.uMax) ? mustBeNumber_1.mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined_1.isDefined(options.uSegments) ? options.uSegments : 1;
    var mode = isDefined_1.isDefined(options.mode) ? options.mode : CurveMode_1.CurveMode.LINES;
    // Working on the assumption that the grid is open in both directions.
    var curve = topology(mode, uSegments, false);
    var iLen = curve.uLength;
    if (uSegments > 0) {
        for (var i = 0; i < iLen; i++) {
            var vertex = curve.vertex(i);
            var u = uMin + (uMax - uMin) * i / uSegments;
            transformVertex(vertex, u, options);
        }
    }
    else {
        var vertex = curve.vertex(0);
        var u = (uMin + uMax) / 2;
        transformVertex(vertex, u, options);
    }
    return curve.toPrimitive();
}
exports.curvePrimitive = curvePrimitive;
