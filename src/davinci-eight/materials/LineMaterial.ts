import Engine from '../core/Engine'
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import isDefined from '../checks/isDefined'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'
import LineMaterialOptions from './LineMaterialOptions'
import Material from './Material'
import mustBeObject from '../checks/mustBeObject'

/**
 * @module EIGHT
 * @submodule materials
 */

function builder(options?: LineMaterialOptions) {

  if (isNull(options) || isUndefined(options)) {
    options = { attributes: {}, uniforms: {} }

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'
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

function vertexShaderSrc(options?: LineMaterialOptions): string {
  return builder(options).vertexShaderSrc()
}

function fragmentShaderSrc(options?: LineMaterialOptions): string {
  return builder(options).fragmentShaderSrc()
}

/**
 * Generates a WebGLProgram suitable for use with LINES, LINE_STRIP, and LINE_LOOP.
 *
 * <table>
 * <tr>
 * <td>attribute</td><td>vec3</td><td>aPosition</td>
 * </tr>
 * </table>
 *
 * @class LineMaterial
 * @extends Material
 */
export default class LineMaterial extends Material {
  /**
   * @class LineMaterial
   * @constructor
   * @param options {LineMaterialOptions}
   * @param engine {Engine}
   */
  constructor(options: LineMaterialOptions, engine: Engine) {
    super(vertexShaderSrc(options), fragmentShaderSrc(options), [], 'LineMaterial', engine)
  }
}
