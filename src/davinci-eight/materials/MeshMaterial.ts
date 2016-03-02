import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import isDefined from '../checks/isDefined'
import Material from '../core/Material'
import MeshMaterialOptions from './MeshMaterialOptions'
import mustBeObject from '../checks/mustBeObject'

function builder(options?: MeshMaterialOptions) {
  if (isDefined(options)) {
    mustBeObject('options', options)
  }
  else {
    options = { attributes: {}, uniforms: {} }

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
    // FIXME: The default should probably be no aNormal.
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'

    options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3'
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3'
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

/**
 * @module EIGHT
 * @submodule materials
 */

function vertexShader(options?: MeshMaterialOptions): string {
  return builder(options).vertexShader()
}

function fragmentShader(options?: MeshMaterialOptions): string {
  return builder(options).fragmentShader()
}

/**
 * @class MeshMaterial
 * @extends Material
 */
export default class MeshMaterial extends Material {
  /**
   * 
   * @class MeshMaterial
   * @constructor
   * @param [options] {MeshMaterialOptions}
   */
  constructor(options?: MeshMaterialOptions) {
    super(vertexShader(options), fragmentShader(options))
  }
}
