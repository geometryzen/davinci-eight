import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import LineMaterialOptions from './LineMaterialOptions'
import Material from '../core/Material'

/**
 * @module EIGHT
 * @submodule materials
 */

function builder(options: LineMaterialOptions) {
  const gpb = new GraphicsProgramBuilder()

  gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3)
  gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3)

  gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')
  gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4')
  gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4')
  gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4')

  return gpb
}

function vertexShader(options: LineMaterialOptions): string {
  return builder(options).vertexShader()
}

function fragmentShader(options: LineMaterialOptions): string {
  return builder(options).fragmentShader()
}

/**
 * @class LineMaterial
 * @extends Material
 */
export default class LineMaterial extends Material {
  /**
   * @class LineMaterial
   * @constructor
   * @param [options] {LineMaterialOptions}
   */
  constructor(options: LineMaterialOptions = {}) {
    super(vertexShader(options), fragmentShader(options))
  }
}
