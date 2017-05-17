"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../core/Color");
var GeometryMode_1 = require("./GeometryMode");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var GridLines_1 = require("../atoms/GridLines");
var GridPoints_1 = require("../atoms/GridPoints");
var GridTriangleStrip_1 = require("../atoms/GridTriangleStrip");
var isDefined_1 = require("../checks/isDefined");
var isFunction_1 = require("../checks/isFunction");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 *
 */
function topology(mode, uSegments, uClosed, vSegments, vClosed) {
    switch (mode) {
        case GeometryMode_1.GeometryMode.POINT: {
            return new GridPoints_1.GridPoints(uSegments, uClosed, vSegments, vClosed);
        }
        case GeometryMode_1.GeometryMode.WIRE: {
            return new GridLines_1.GridLines(uSegments, uClosed, vSegments, vClosed);
        }
        case GeometryMode_1.GeometryMode.MESH: {
            return new GridTriangleStrip_1.GridTriangleStrip(uSegments, vSegments);
        }
        default: {
            throw new Error("mode must be POINT = " + GeometryMode_1.GeometryMode.POINT + ", WIRE = " + GeometryMode_1.GeometryMode.WIRE + " or MESH = " + GeometryMode_1.GeometryMode.MESH);
        }
    }
}
/**
 * Decorates the vertex with aPosition, aNormal, and aColor attributes,
 * but only if these functions are provided in the options.
 */
function transformVertex(vertex, u, v, options) {
    var aPosition = isDefined_1.isDefined(options.aPosition) ? options.aPosition : void 0;
    var aNormal = isDefined_1.isDefined(options.aNormal) ? options.aNormal : void 0;
    var aColor = isDefined_1.isDefined(options.aColor) ? options.aColor : void 0;
    var aCoords = isDefined_1.isDefined(options.aCoords) ? options.aCoords : void 0;
    if (isFunction_1.isFunction(aCoords)) {
        var coords = aCoords(u, v);
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = Vector2_1.Vector2.vector(coords.u, coords.v);
    }
    if (isFunction_1.isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3_1.Vector3.copy(aPosition(u, v));
    }
    if (isFunction_1.isFunction(aNormal)) {
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(aNormal(u, v));
    }
    if (isFunction_1.isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color_1.Color.copy(aColor(u, v));
    }
}
function gridPrimitive(options) {
    var uMin = isDefined_1.isDefined(options.uMin) ? mustBeNumber_1.mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined_1.isDefined(options.uMax) ? mustBeNumber_1.mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined_1.isDefined(options.uSegments) ? mustBeNumber_1.mustBeNumber('uSegments', options.uSegments) : 1;
    var uClosed = isDefined_1.isDefined(options.uClosed) ? mustBeBoolean_1.mustBeBoolean('uClosed', options.uClosed) : false;
    var vMin = isDefined_1.isDefined(options.vMin) ? mustBeNumber_1.mustBeNumber('vMin', options.vMin) : 0;
    var vMax = isDefined_1.isDefined(options.vMax) ? mustBeNumber_1.mustBeNumber('vMax', options.vMax) : 1;
    var vSegments = isDefined_1.isDefined(options.vSegments) ? mustBeNumber_1.mustBeNumber('vSegments', options.vSegments) : 1;
    var vClosed = isDefined_1.isDefined(options.vClosed) ? mustBeBoolean_1.mustBeBoolean('vClosed', options.vClosed) : false;
    var mode = isDefined_1.isDefined(options.mode) ? options.mode : GeometryMode_1.GeometryMode.WIRE;
    var grid = topology(mode, uSegments, uClosed, vSegments, vClosed);
    var iLen = grid.uLength;
    var jLen = grid.vLength;
    if (uSegments > 0) {
        if (vSegments > 0) {
            for (var i = 0; i < iLen; i++) {
                for (var j = 0; j < jLen; j++) {
                    var vertex = grid.vertex(i, j);
                    var u = uMin + (uMax - uMin) * i / uSegments;
                    var v = vMin + (vMax - vMin) * j / vSegments;
                    transformVertex(vertex, u, v, options);
                }
            }
        }
        else {
            for (var i = 0; i < iLen; i++) {
                var vertex = grid.vertex(i, 0);
                var u = uMin + (uMax - uMin) * i / uSegments;
                var v = (vMin + vMax) / 2;
                transformVertex(vertex, u, v, options);
            }
        }
    }
    else {
        if (vSegments > 0) {
            for (var j = 0; j < jLen; j++) {
                var vertex = grid.vertex(0, j);
                var u = (uMin + uMax) / 2;
                var v = vMin + (vMax - vMin) * j / vSegments;
                transformVertex(vertex, u, v, options);
            }
        }
        else {
            var vertex = grid.vertex(0, 0);
            var u = (uMin + uMax) / 2;
            var v = (vMin + vMax) / 2;
            transformVertex(vertex, u, v, options);
        }
    }
    return grid.toPrimitive();
}
exports.gridPrimitive = gridPrimitive;
