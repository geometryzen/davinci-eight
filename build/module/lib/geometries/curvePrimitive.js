import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { LineStrip } from '../atoms/LineStrip';
import { CurveMode } from './CurveMode';
import { LinePoints } from '../atoms/LinePoints';
import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Vector3 } from '../math/Vector3';
function aPositionDefault(u) {
    return Vector3.vector(u, 0, 0);
}
function topology(mode, uSegments, uClosed) {
    switch (mode) {
        case CurveMode.POINTS: {
            return new LinePoints(uSegments);
        }
        case CurveMode.LINES: {
            return new LineStrip(uSegments);
        }
        default: {
            throw new Error("mode must be POINTS or LINES");
        }
    }
}
function transformVertex(vertex, u, options) {
    var aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault;
    var aColor = isDefined(options.aColor) ? options.aColor : void 0;
    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u));
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u));
    }
}
export function curvePrimitive(options) {
    var uMin = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined(options.uSegments) ? options.uSegments : 1;
    var mode = isDefined(options.mode) ? options.mode : CurveMode.LINES;
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
