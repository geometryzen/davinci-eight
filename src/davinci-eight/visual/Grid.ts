import DrawMode from '../core/DrawMode'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import GridGeometry from '../geometries/GridGeometry'
import GridGeometryOptions from '../geometries/GridGeometryOptions'
import GridOptions from './GridOptions'
import incLevel from '../base/incLevel';
import isDefined from '../checks/isDefined'
import isFunction from '../checks/isFunction'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'
import {LineMaterial} from '../materials/LineMaterial'
import LineMaterialOptions from '../materials/LineMaterialOptions'
import {Mesh} from '../core/Mesh'
import {MeshMaterial} from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import {PointMaterial} from '../materials/PointMaterial'
import PointMaterialOptions from '../materials/PointMaterialOptions'
import R3 from '../math/R3'
import {Unit} from '../math/Unit'

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

function transferGeometryOptions(source: GridOptions, target: GridGeometryOptions): void {

  if (isFunctionOrNull(source.aPosition)) {
    target.aPosition = source.aPosition
  }
  else if (isUndefined(source.aPosition)) {
    target.aPosition = aPositionDefault
  }
  else {
    throw new Error("aPosition must be one of function, null, or undefined.")
  }

  if (isFunctionOrNull(source.aNormal)) {
    target.aNormal = source.aNormal
  }
  else if (isUndefined(source.aNormal)) {
    target.aNormal = aNormalDefault
  }
  else {
    throw new Error("aNormal must be one of function, null, or undefined.")
  }

  if (isFunctionOrNull(source.aColor)) {
    target.aColor = source.aColor
  }
  else if (isUndefined(source.aColor)) {
    // Do nothing.
  }
  else {
    throw new Error("aColor must be one of function, null, or undefined.")
  }

  if (isDefined(source.uMax)) {
    target.uMax = mustBeNumber('uMax', source.uMax)
  }
  else {
    target.uMax = +0.5
  }

  if (isDefined(source.uMin)) {
    target.uMin = mustBeNumber('uMin', source.uMin)
  }
  else {
    target.uMin = -0.5
  }

  if (isDefined(source.uSegments)) {
    target.uSegments = mustBeGE('uSegments', source.uSegments, 0)
  }
  else {
    target.uSegments = 1
  }

  if (isDefined(source.vMax)) {
    target.vMax = mustBeNumber('vMax', source.vMax)
  }
  else {
    target.vMax = +0.5
  }

  if (isDefined(source.vMin)) {
    target.vMin = mustBeNumber('vMin', source.vMin)
  }
  else {
    target.vMin = -0.5
  }

  if (isDefined(source.vSegments)) {
    target.vSegments = mustBeGE('vSegments', source.vSegments, 0)
  }
  else {
    target.vSegments = 1
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

  const material = new PointMaterial(matOptions, options.engine)
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

  const material = new LineMaterial(matOptions, options.engine)
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

  const material = new MeshMaterial(matOptions, options.engine)
  grid.material = material
  material.release()
}

/**
 *
 */
export class Grid extends Mesh {

  /**
   *
   * @param options
   */
  constructor(options: GridOptions = {}) {
    super(void 0, void 0, null)
    this.setLoggingName('Grid')

    const drawMode: DrawMode = isDefined(options.drawMode) ? options.drawMode : DrawMode.LINES
    switch (drawMode) {
      case DrawMode.POINTS: {
        configPoints(options, this)
      }
        break
      case DrawMode.LINES:
      case DrawMode.LINE_STRIP: {
        configLines(options, this)
      }
        break
      case DrawMode.TRIANGLE_STRIP:
      case DrawMode.TRIANGLES: {
        configMesh(options, this)
      }
        break
      default: {
        throw new Error(`'${drawMode}' is not a valid option for drawMode.`)
      }
    }
  }

  /**
   * @param levelUp
   */
  protected destructor(levelUp: number): void {
    super.destructor(incLevel(levelUp))
  }
}
