import Engine from '../core/Engine'
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import isDefined from '../checks/isDefined'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'
import MaterialBase from './MaterialBase'
import mustBeObject from '../checks/mustBeObject'
import PointMaterialOptions from './PointMaterialOptions'

/**
 * @module EIGHT
 * @submodule materials
 */

function builder(options: PointMaterialOptions) {
  if (isNull(options) || isUndefined(options)) {
    options = { attributes: {}, uniforms: {} }

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'

    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float'
  }
  else {
    mustBeObject('options', options)
  }

  const attributes: { [name: string]: number } = isDefined(options.attributes) ? options.attributes : {}
  const uniforms: { [name: string]: string } = isDefined(options.uniforms) ? options.uniforms : {}

  const gpb = new GraphicsProgramBuilder()

  const aNames = Object.keys(attributes)
  for (let a = 0; a < aNames.length; a++) {
    const aName = aNames[a]
    const size: number = attributes[aName]
    gpb.attribute(aName, size)
  }

  const uNames = Object.keys(uniforms)
  for (let u = 0; u < uNames.length; u++) {
    const uName = uNames[u]
    const type: string = uniforms[uName]
    gpb.uniform(uName, type)
  }

  return gpb
}

function vertexShaderSrc(options?: PointMaterialOptions): string {
  return builder(options).vertexShaderSrc()
}

function fragmentShaderSrc(options?: PointMaterialOptions): string {
  return builder(options).fragmentShaderSrc()
}

/**
 * @class PointMaterial
 * @extends MaterialBase
 */
export default class PointMaterial extends MaterialBase {

  /**
   * @class PointMaterial
   * @constructor
   * @param options {PointMaterialOptions}
   * @param engine {Engine}
   */
  constructor(options: PointMaterialOptions, engine: Engine) {
    super(
      vertexShaderSrc(options),
      fragmentShaderSrc(options),
      [],
      engine
    )
    this.setLoggingName('PointMaterial')
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }
}
