import Color from '../core/Color'
import DrawMode from '../core/DrawMode'
import GeometryBuffers from '../core/GeometryBuffers'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import GridLines from './primitives/GridLines'
import GridGeometryOptions from './GridGeometryOptions'
import GridPoints from './primitives/GridPoints'
import GridPrimitive from './primitives/GridPrimitive'
import GridTriangleStrip from './primitives/GridTriangleStrip'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import R3 from '../math/R3'
import Unit from '../math/Unit'
import Vector3 from '../math/Vector3'
import VertexArrays from '../core/VertexArrays'

function aPositionDefault(u: number, v: number): R3 {
  return R3.vector(u, v, 0, Unit.ONE)
}

function aNormalDefault(u: number, v: number): R3 {
  return R3.e3
}

function topology(drawMode: DrawMode, uSegments: number, vSegments: number): GridPrimitive {
  switch (drawMode) {
    case DrawMode.POINTS: {
      return new GridPoints(uSegments, vSegments)
    }
    case DrawMode.LINES: {
      return new GridLines(uSegments, vSegments)
    }
    case DrawMode.TRIANGLE_STRIP: {
      return new GridTriangleStrip(uSegments, vSegments)
    }
    default: {
      throw new Error(`drawMode must be POINTS, LINES or TRIANGLE_STRIP`)
    }
  }
}

function dataSource(options: GridGeometryOptions): VertexArrays {

  const uMin: number = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0
  const uMax: number = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1
  const uSegments = isDefined(options.uSegments) ? options.uSegments : 1

  const vMin: number = isDefined(options.vMin) ? mustBeNumber('vMin', options.vMin) : 0
  const vMax: number = isDefined(options.vMax) ? mustBeNumber('vMax', options.vMax) : 1
  const vSegments = isDefined(options.vSegments) ? options.vSegments : 1

  const aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault
  const aNormal = isDefined(options.aNormal) ? options.aNormal : aNormalDefault
  const aColor = isDefined(options.aColor) ? options.aColor : void 0

  const drawMode = isDefined(options.drawMode) ? options.drawMode : DrawMode.LINES
  const grid: GridPrimitive = topology(drawMode, uSegments, vSegments)

  const iLen = grid.uLength
  const jLen = grid.vLength

  for (let i = 0; i < iLen; i++) {
    for (let j = 0; j < jLen; j++) {
      const vertex = grid.vertex(i, j)
      const u = uMin + (uMax - uMin) * i / uSegments
      const v = vMin + (vMax - vMin) * j / vSegments

      if (aPosition) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u, v))
      }
      if (aNormal) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(aNormal(u, v))
      }
      if (aColor) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u, v))
      }
    }
  }
  return grid.toVertexArrays()
}

/**
 * @class GridGeometry
 * @extends GeometryBuffers
 */
export default class GridGeometry extends GeometryBuffers {

  /**
   * @class GridGeometry
   * @constructor
   * @param [options] {GridGeometryOptions}
   */
  constructor(options: GridGeometryOptions = {}) {
    super(dataSource(options))
  }
}
