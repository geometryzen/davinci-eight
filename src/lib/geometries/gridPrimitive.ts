import { GridLines } from '../atoms/GridLines';
import { GridPoints } from '../atoms/GridPoints';
import { GridPrimitive } from '../atoms/GridPrimitive';
import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { Vertex } from '../atoms/Vertex';
import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Primitive } from '../core/Primitive';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { GeometryMode } from './GeometryMode';
import { GridGeometryOptions } from './GridGeometryOptions';

/**
 * @hidden
 */
function topology(mode: GeometryMode, uSegments: number, uClosed: boolean, vSegments: number, vClosed: boolean): GridPrimitive {
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
            throw new Error(`mode must be POINT = ${GeometryMode.POINT}, WIRE = ${GeometryMode.WIRE} or MESH = ${GeometryMode.MESH}`);
        }
    }
}

/**
 * Decorates the vertex with aPosition, aNormal, and aColor attributes,
 * but only if these functions are provided in the options.
 * @hidden
 */
function transformVertex(vertex: Vertex, u: number, v: number, options: GridGeometryOptions) {

    const aPosition = isDefined(options.aPosition) ? options.aPosition : void 0;
    const aNormal = isDefined(options.aNormal) ? options.aNormal : void 0;
    const aColor = isDefined(options.aColor) ? options.aColor : void 0;
    const aCoords = isDefined(options.aCoords) ? options.aCoords : void 0;

    if (isFunction(aCoords)) {
        const coords = aCoords(u, v);
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
export function gridPrimitive(options: GridGeometryOptions): Primitive {

    const uMin: number = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    const uMax: number = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    const uSegments: number = isDefined(options.uSegments) ? mustBeNumber('uSegments', options.uSegments) : 1;
    const uClosed: boolean = isDefined(options.uClosed) ? mustBeBoolean('uClosed', options.uClosed) : false;

    const vMin: number = isDefined(options.vMin) ? mustBeNumber('vMin', options.vMin) : 0;
    const vMax: number = isDefined(options.vMax) ? mustBeNumber('vMax', options.vMax) : 1;
    const vSegments = isDefined(options.vSegments) ? mustBeNumber('vSegments', options.vSegments) : 1;
    const vClosed: boolean = isDefined(options.vClosed) ? mustBeBoolean('vClosed', options.vClosed) : false;

    const mode: GeometryMode = isDefined(options.mode) ? options.mode : GeometryMode.WIRE;
    const grid: GridPrimitive = topology(mode, uSegments, uClosed, vSegments, vClosed);

    const iLen = grid.uLength;
    const jLen = grid.vLength;

    if (uSegments > 0) {
        if (vSegments > 0) {
            for (let i = 0; i < iLen; i++) {
                for (let j = 0; j < jLen; j++) {
                    const vertex = grid.vertex(i, j);
                    const u = uMin + (uMax - uMin) * i / uSegments;
                    const v = vMin + (vMax - vMin) * j / vSegments;
                    transformVertex(vertex, u, v, options);
                }
            }
        }
        else {
            for (let i = 0; i < iLen; i++) {
                const vertex = grid.vertex(i, 0);
                const u = uMin + (uMax - uMin) * i / uSegments;
                const v = (vMin + vMax) / 2;
                transformVertex(vertex, u, v, options);
            }
        }
    }
    else {
        if (vSegments > 0) {
            for (let j = 0; j < jLen; j++) {
                const vertex = grid.vertex(0, j);
                const u = (uMin + uMax) / 2;
                const v = vMin + (vMax - vMin) * j / vSegments;
                transformVertex(vertex, u, v, options);
            }
        }
        else {
            const vertex = grid.vertex(0, 0);
            const u = (uMin + uMax) / 2;
            const v = (vMin + vMax) / 2;
            transformVertex(vertex, u, v, options);
        }
    }
    return grid.toPrimitive();
}
