import BeginMode from '../core/BeginMode';
import {Color} from '../core/Color';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridLines from '../atoms/GridLines';
import GridGeometryOptions from './GridGeometryOptions';
import GridPoints from '../atoms/GridPoints';
import GridPrimitive from '../atoms/GridPrimitive';
import GridTriangleStrip from '../atoms/GridTriangleStrip';
import isDefined from '../checks/isDefined';
import isFunction from '../checks/isFunction';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Vertex from '../atoms/Vertex';

function aPositionDefault(u: number, v: number): VectorE3 {
    return Vector3.vector(u, v, 0);
}

function aNormalDefault(u: number, v: number): VectorE3 {
    return Vector3.vector(0, 0, 1);
}

function topology(mode: BeginMode, uSegments: number, uClosed: boolean, vSegments: number, vClosed: boolean): GridPrimitive {
    switch (mode) {
        case BeginMode.POINTS: {
            return new GridPoints(uSegments, uClosed, vSegments, vClosed)
        }
        case BeginMode.LINES: {
            return new GridLines(uSegments, uClosed, vSegments, vClosed)
        }
        case BeginMode.TRIANGLE_STRIP: {
            return new GridTriangleStrip(uSegments, vSegments)
        }
        default: {
            throw new Error(`mode must be POINTS, LINES or TRIANGLE_STRIP`)
        }
    }
}

function transformVertex(vertex: Vertex, u: number, v: number, options: GridGeometryOptions) {

    const aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault
    const aNormal = isDefined(options.aNormal) ? options.aNormal : aNormalDefault
    const aColor = isDefined(options.aColor) ? options.aColor : void 0

    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u, v))
    }
    if (isFunction(aNormal)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(aNormal(u, v))
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u, v))
    }
}

export default function gridPrimitive(options: GridGeometryOptions): Primitive {

    const uMin: number = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0
    const uMax: number = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1
    const uSegments = isDefined(options.uSegments) ? options.uSegments : 1

    const vMin: number = isDefined(options.vMin) ? mustBeNumber('vMin', options.vMin) : 0
    const vMax: number = isDefined(options.vMax) ? mustBeNumber('vMax', options.vMax) : 1
    const vSegments = isDefined(options.vSegments) ? options.vSegments : 1

    const mode = isDefined(options.mode) ? options.mode : BeginMode.LINES
    // Working on the assumption that the grid is open in both directions.
    const grid: GridPrimitive = topology(mode, uSegments, false, vSegments, false)

    const iLen = grid.uLength
    const jLen = grid.vLength

    if (uSegments > 0) {
        if (vSegments > 0) {
            for (let i = 0; i < iLen; i++) {
                for (let j = 0; j < jLen; j++) {
                    const vertex = grid.vertex(i, j)
                    const u = uMin + (uMax - uMin) * i / uSegments
                    const v = vMin + (vMax - vMin) * j / vSegments
                    transformVertex(vertex, u, v, options)
                }
            }
        }
        else {
            for (let i = 0; i < iLen; i++) {
                const vertex = grid.vertex(i, 0)
                const u = uMin + (uMax - uMin) * i / uSegments
                const v = (vMin + vMax) / 2
                transformVertex(vertex, u, v, options)
            }
        }
    }
    else {
        if (vSegments > 0) {
            for (let j = 0; j < jLen; j++) {
                const vertex = grid.vertex(0, j)
                const u = (uMin + uMax) / 2
                const v = vMin + (vMax - vMin) * j / vSegments
                transformVertex(vertex, u, v, options)
            }
        }
        else {
            const vertex = grid.vertex(0, 0)
            const u = (uMin + uMax) / 2
            const v = (vMin + vMax) / 2
            transformVertex(vertex, u, v, options)
        }
    }
    return grid.toPrimitive()
}
