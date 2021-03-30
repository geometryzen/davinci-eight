import { GridLines } from '../atoms/GridLines';
import { GridPoints } from '../atoms/GridPoints';
import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { GeometryMode } from './GeometryMode';
/**
 * @hidden
 */
function topology(mode, uSegments, uClosed, vSegments, vClosed) {
    switch (mode) {
        case GeometryMode.POINT: {
            return new GridPoints(uSegments, uClosed, vSegments, vClosed);
        }
        case GeometryMode.WIRE: {
            return new GridLines(uSegments, uClosed, vSegments, vClosed);
        }
        case GeometryMode.MESH: {
            return new GridTriangleStrip(uSegments, vSegments);
        }
        default: {
            throw new Error("mode must be POINT = " + GeometryMode.POINT + ", WIRE = " + GeometryMode.WIRE + " or MESH = " + GeometryMode.MESH);
        }
    }
}
/**
 * Decorates the vertex with aPosition, aNormal, and aColor attributes,
 * but only if these functions are provided in the options.
 * @hidden
 */
function transformVertex(vertex, u, v, options) {
    var aPosition = isDefined(options.aPosition) ? options.aPosition : void 0;
    var aNormal = isDefined(options.aNormal) ? options.aNormal : void 0;
    var aColor = isDefined(options.aColor) ? options.aColor : void 0;
    var aCoords = isDefined(options.aCoords) ? options.aCoords : void 0;
    if (isFunction(aCoords)) {
        var coords = aCoords(u, v);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = Vector2.vector(coords.u, coords.v);
    }
    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u, v));
    }
    if (isFunction(aNormal)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(aNormal(u, v));
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u, v));
    }
}
/**
 * @hidden
 */
export function gridPrimitive(options) {
    var uMin = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined(options.uSegments) ? mustBeNumber('uSegments', options.uSegments) : 1;
    var uClosed = isDefined(options.uClosed) ? mustBeBoolean('uClosed', options.uClosed) : false;
    var vMin = isDefined(options.vMin) ? mustBeNumber('vMin', options.vMin) : 0;
    var vMax = isDefined(options.vMax) ? mustBeNumber('vMax', options.vMax) : 1;
    var vSegments = isDefined(options.vSegments) ? mustBeNumber('vSegments', options.vSegments) : 1;
    var vClosed = isDefined(options.vClosed) ? mustBeBoolean('vClosed', options.vClosed) : false;
    var mode = isDefined(options.mode) ? options.mode : GeometryMode.WIRE;
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
