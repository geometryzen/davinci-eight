import DrawMode from '../core/DrawMode'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import GridGeometry from '../geometries/GridGeometry'
import GridGeometryOptions from '../geometries/GridGeometryOptions'
import GridOptions from './GridOptions'
import isDefined from '../checks/isDefined'
import isFunction from '../checks/isFunction'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'
import LineMaterial from '../materials/LineMaterial'
import LineMaterialOptions from '../materials/LineMaterialOptions'
import Mesh from '../core/Mesh'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import PointMaterial from '../materials/PointMaterial'
import PointMaterialOptions from '../materials/PointMaterialOptions'
import R3 from '../math/R3'
import Unit from '../math/Unit'

function aPositionDefault(u: number, v: number): R3 {
  return R3.vector(u, v, 0, Unit.ONE)
}

function aNormalDefault(u: number, v: number): R3 {
  return R3.e3
}

function isFunctionOrNull(x: any): boolean {
  return isFunction(x) || isNull(x)
}

function isFunctionOrUndefined(x: any): boolean {
  return isFunction(x) || isUndefined(x)
}

function transferGeometryOptions(options: GridOptions, geoOptions: GridGeometryOptions): void {

  if (isFunctionOrNull(options.aPosition)) {
    geoOptions.aPosition = options.aPosition
  }
  else if (isUndefined(options.aPosition)) {
    geoOptions.aPosition = aPositionDefault
  }
  else {
    throw new Error("aPosition must be one of function, null, or undefined.")
  }

  if (isFunctionOrNull(options.aNormal)) {
    geoOptions.aNormal = options.aNormal
  }
  else if (isUndefined(options.aNormal)) {
    geoOptions.aNormal = aNormalDefault
  }
  else {
    throw new Error("aNormal must be one of function, null, or undefined.")
  }

  if (isFunctionOrNull(options.aColor)) {
    geoOptions.aColor = options.aColor
  }
  else if (isUndefined(options.aColor)) {
    // Do nothing.
  }
  else {
    throw new Error("aColor must be one of function, null, or undefined.")
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

  const matOptions: PointMaterialOptions = { attributes: {}, uniforms: {} }

  if (isFunctionOrUndefined(options.aPosition)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
  }
  else if (isNull(options.aPosition)) {
    // We're being instructed not to have a position attribute.
  }
  else {
    throw new Error()
  }

  if (isFunction(options.aColor)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3
  }
  else {
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
  }

  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float'

  const material = new PointMaterial(matOptions)
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

  const matOptions: LineMaterialOptions = { attributes: {}, uniforms: {} }

  if (isFunctionOrUndefined(options.aPosition)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
  }
  else if (isNull(options.aPosition)) {
    // We're being instructed not to have a position attribute.
  }
  else {
    throw new Error()
  }

  if (isFunction(options.aNormal)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3
  }
  if (isFunction(options.aColor)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3
  }
  else {
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
  }

  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'

  const material = new LineMaterial(matOptions)
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

  const matOptions: MeshMaterialOptions = { attributes: {}, uniforms: {} }

  if (isFunctionOrUndefined(options.aPosition)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
  }
  else if (isNull(options.aPosition)) {
    // We're being instructed not to have the aPosition attribute.
  }
  else {
    throw new Error()
  }

  if (isFunctionOrUndefined(options.aNormal)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3'
  }
  else if (isNull(options.aNormal)) {
    // We're being instructed not to have the aNormal attribute.
  }
  else {
    throw new Error()
  }

  if (isFunction(options.aColor)) {
    matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3
  }
  else if (isNull(options.aColor)) {
    // We're being instructed not to have the aColor attribute.
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
  }
  else if (isUndefined(options.aColor)) {
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
  }
  else {
    throw new Error()
  }

  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'

  matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3'

  const material = new MeshMaterial(matOptions)
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
