import {Color} from '../core/Color'
import BeginMode from '../core/BeginMode'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import LineStrip from '../atoms/LineStrip'
import CurveGeometryOptions from './CurveGeometryOptions'
import LinePoints from '../atoms/LinePoints'
import CurvePrimitive from '../atoms/CurvePrimitive'
import isDefined from '../checks/isDefined'
import isFunction from '../checks/isFunction'
import mustBeNumber from '../checks/mustBeNumber'
import R3 from '../math/R3'
import {Unit} from '../math/Unit'
import Vector3 from '../math/Vector3'
import Vertex from '../atoms/Vertex'
import VertexArrays from '../core/VertexArrays'

function aPositionDefault(u: number): R3 {
    return R3.vector(u, 0, 0, Unit.ONE)
}

function topology(mode: BeginMode, uSegments: number, uClosed: boolean): CurvePrimitive {
    switch (mode) {
        case BeginMode.POINTS: {
            return new LinePoints(uSegments)
        }
        case BeginMode.LINES: {
            return new LineStrip(uSegments)
        }
        default: {
            throw new Error(`drawMode must be POINTS, LINES`)
        }
    }
}

function transformVertex(vertex: Vertex, u: number, options: CurveGeometryOptions) {

    const aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault
    const aColor = isDefined(options.aColor) ? options.aColor : void 0

    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u))
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u))
    }
}

export default function(options: CurveGeometryOptions): VertexArrays {

    const uMin: number = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0
    const uMax: number = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1
    const uSegments = isDefined(options.uSegments) ? options.uSegments : 1

    const drawMode = isDefined(options.drawMode) ? options.drawMode : BeginMode.LINES
    // Working on the assumption that the grid is open in both directions.
    const curve: CurvePrimitive = topology(drawMode, uSegments, false)

    const iLen = curve.uLength

    if (uSegments > 0) {
        for (let i = 0; i < iLen; i++) {
            const vertex = curve.vertex(i)
            const u = uMin + (uMax - uMin) * i / uSegments
            transformVertex(vertex, u, options)
        }
    }
    else {
        const vertex = curve.vertex(0)
        const u = (uMin + uMax) / 2
        transformVertex(vertex, u, options)
    }
    const vas = curve.toVertexArrays()
    return vas
}
