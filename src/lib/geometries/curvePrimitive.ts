import { CurvePrimitive } from '../atoms/CurvePrimitive';
import { LinePoints } from '../atoms/LinePoints';
import { LineStrip } from '../atoms/LineStrip';
import { Vertex } from '../atoms/Vertex';
import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { CurveGeometryOptions } from './CurveGeometryOptions';
import { CurveMode } from './CurveMode';

/**
 * @hidden
 */
function aPositionDefault(u: number): VectorE3 {
    return Vector3.vector(u, 0, 0);
}

/**
 * @hidden
 */
function topology(mode: CurveMode, uSegments: number, uClosed: boolean): CurvePrimitive {
    switch (mode) {
        case CurveMode.POINTS: {
            return new LinePoints(uSegments);
        }
        case CurveMode.LINES: {
            return new LineStrip(uSegments);
        }
        default: {
            throw new Error(`mode must be POINTS or LINES`);
        }
    }
}

/**
 * @hidden
 */
function transformVertex(vertex: Vertex, u: number, options: CurveGeometryOptions) {

    const aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault;
    const aColor = isDefined(options.aColor) ? options.aColor : void 0;

    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u));
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u));
    }
}

/**
 * @hidden
 */
export function curvePrimitive(options: CurveGeometryOptions): Primitive {

    const uMin: number = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    const uMax: number = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    const uSegments = isDefined(options.uSegments) ? options.uSegments : 1;

    const mode: CurveMode = isDefined(options.mode) ? options.mode : CurveMode.LINES;
    // Working on the assumption that the grid is open in both directions.
    const curve: CurvePrimitive = topology(mode, uSegments, false);

    const iLen = curve.uLength;

    if (uSegments > 0) {
        for (let i = 0; i < iLen; i++) {
            const vertex = curve.vertex(i);
            const u = uMin + (uMax - uMin) * i / uSegments;
            transformVertex(vertex, u, options);
        }
    }
    else {
        const vertex = curve.vertex(0);
        const u = (uMin + uMax) / 2;
        transformVertex(vertex, u, options);
    }
    return curve.toPrimitive();
}
