import DrawMode from '../core/DrawMode'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import CurveGeometry from '../geometries/CurveGeometry'
import CurveGeometryOptions from '../geometries/CurveGeometryOptions'
import CurveOptions from './CurveOptions'
import isDefined from '../checks/isDefined'
import isFunction from '../checks/isFunction'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'
import LineMaterial from '../materials/LineMaterial'
import LineMaterialOptions from '../materials/LineMaterialOptions'
import Mesh from '../core/Mesh'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import PointMaterial from '../materials/PointMaterial'
import PointMaterialOptions from '../materials/PointMaterialOptions'
import R3 from '../math/R3'
import Unit from '../math/Unit'

/**
 * @module EIGHT
 * @submodule visual
 */

function aPositionDefault(u: number): R3 {
  return R3.vector(u, 0, 0, Unit.ONE)
}

function isFunctionOrNull(x: any): boolean {
  return isFunction(x) || isNull(x)
}

function isFunctionOrUndefined(x: any): boolean {
  return isFunction(x) || isUndefined(x)
}

function transferGeometryOptions(options: CurveOptions, geoOptions: CurveGeometryOptions): void {

  if (isFunctionOrNull(options.aPosition)) {
    geoOptions.aPosition = options.aPosition
  }
  else if (isUndefined(options.aPosition)) {
    geoOptions.aPosition = aPositionDefault
  }
  else {
    throw new Error("aPosition must be one of function, null, or undefined.")
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
}

function configPoints(options: CurveOptions, curve: Curve) {
  const geoOptions: CurveGeometryOptions = {}
  transferGeometryOptions(options, geoOptions)
  geoOptions.drawMode = DrawMode.POINTS
  const geometry = new CurveGeometry(geoOptions)
  curve.geometry = geometry
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
  curve.material = material
  material.release()
}

function configLines(options: CurveOptions, curve: Curve) {
  const geoOptions: CurveGeometryOptions = {}
  transferGeometryOptions(options, geoOptions)
  geoOptions.drawMode = DrawMode.LINES
  const geometry = new CurveGeometry(geoOptions)
  curve.geometry = geometry
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
  curve.material = material
  material.release()
}

/**
 * 
 * @class Curve
 * @extends Mesh
 */
export default class Curve extends Mesh {

  /**
   * @class Curve
   * @constructor
   * @param [options] {CurveOptions}
   */
  constructor(options: CurveOptions = {}) {
    super('Curve', void 0, void 0, options.engine)

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
      default: {
        throw new Error(`'${drawMode}' is not a valid option for drawMode.`)
      }
    }
  }
}
