import DrawMode from '../core/DrawMode'
import GridGeometry from '../geometries/GridGeometry'
import GridGeometryOptions from '../geometries/GridGeometryOptions'
import GridOptions from './GridOptions'
import isDefined from '../checks/isDefined'
import LineMaterial from '../materials/LineMaterial'
import Mesh from '../core/Mesh'
import MeshMaterial from '../materials/MeshMaterial'
import mustBeGE from '../checks/mustBeGE'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeNumber from '../checks/mustBeNumber'
import PointMaterial from '../materials/PointMaterial'
import R3 from '../math/R3'
import Unit from '../math/Unit'

function aPositionDefault(u: number, v: number): R3 {
  return R3.vector(u, v, 0, Unit.ONE)
}

function aNormalDefault(u: number, v: number): R3 {
  return R3.e3
}

function transferGeometryOptions(options: GridOptions, geoOptions: GridGeometryOptions): void {

  if (options.aPosition) {
    geoOptions.aPosition = mustBeFunction('aPosition', options.aPosition)
  }
  else {
    geoOptions.aPosition = aPositionDefault
  }

  if (options.aNormal) {
    geoOptions.aNormal = mustBeFunction('aNormal', options.aNormal)
  }
  else {
    geoOptions.aNormal = aNormalDefault
  }

  if (options.aColor) {
    geoOptions.aColor = mustBeFunction('aColor', options.aColor)
  }

  if (isDefined(options.uMax)) {
    geoOptions.uMax = mustBeNumber('uMax', options.uMax)
  }
  else {
    geoOptions.uMax = +0.5
  }

  if (isDefined(options.uMin)) {
    geoOptions.uMin = mustBeNumber('uMin', options.uMin)
  }
  else {
    geoOptions.uMin = -0.5
  }

  if (isDefined(options.uSegments)) {
    geoOptions.uSegments = mustBeGE('uSegments', options.uSegments, 0)
  }
  else {
    geoOptions.uSegments = 1
  }

  if (isDefined(options.vMax)) {
    geoOptions.vMax = mustBeNumber('vMax', options.vMax)
  }
  else {
    geoOptions.vMax = +0.5
  }

  if (isDefined(options.vMin)) {
    geoOptions.vMin = mustBeNumber('vMin', options.vMin)
  }
  else {
    geoOptions.vMin = -0.5
  }

  if (isDefined(options.vSegments)) {
    geoOptions.vSegments = mustBeGE('vSegments', options.vSegments, 0)
  }
  else {
    geoOptions.vSegments = 1
  }
}

function configPoints(options: GridOptions, grid: Grid) {
  const geoOptions: GridGeometryOptions = {}
  transferGeometryOptions(options, geoOptions)
  geoOptions.drawMode = DrawMode.POINTS
  const geometry = new GridGeometry(geoOptions)
  grid.geometry = geometry
  geometry.release()

  const material = new PointMaterial()
  grid.material = material
  material.release()
}

function configLines(options: GridOptions, grid: Grid) {
  const geoOptions: GridGeometryOptions = {}
  transferGeometryOptions(options, geoOptions)
  geoOptions.drawMode = DrawMode.LINES
  const geometry = new GridGeometry(geoOptions)
  grid.geometry = geometry
  geometry.release()

  const material = new LineMaterial()
  grid.material = material
  material.release()
}

function configMesh(options: GridOptions, grid: Grid) {
  const geoOptions: GridGeometryOptions = {}
  transferGeometryOptions(options, geoOptions)
  geoOptions.drawMode = DrawMode.TRIANGLE_STRIP
  const geometry = new GridGeometry(geoOptions)
  grid.geometry = geometry
  geometry.release()

  const material = new MeshMaterial()
  grid.material = material
  material.release()
}

/**
 * 
 * @class Grid
 * @extends Mesh
 */
export default class Grid extends Mesh {

  /**
   * @class Grid
   * @constructor
   * @param [options] {GridOptions}
   */
  constructor(options: GridOptions = {}) {
    super()

    const drawMode: DrawMode = isDefined(options.drawMode) ? options.drawMode : DrawMode.LINES
    switch (drawMode) {
      case DrawMode.POINTS: {
        configPoints(options, this)
      }
        break
      case DrawMode.LINES:
      case DrawMode.LINE_LOOP:
      case DrawMode.LINE_STRIP: {
        configLines(options, this)
      }
        break
      case DrawMode.TRIANGLE_STRIP:
      case DrawMode.TRIANGLES:
      case DrawMode.TRIANGLE_FAN: {
        configMesh(options, this)
      }
        break
      default: {
        throw new Error(`'${drawMode}' is not a valid option for drawMode.`)
      }
    }
  }
}
