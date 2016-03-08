import Engine from '../core/Engine';
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import incLevel from '../base/incLevel'
import isDefined from '../checks/isDefined';
import isNull from '../checks/isNull';
import isUndefined from '../checks/isUndefined';
import Material from './Material';
import MeshMaterialOptions from './MeshMaterialOptions';
import mustBeObject from '../checks/mustBeObject';

/**
 * @module EIGHT
 * @submodule materials
 */

function builder(options?: MeshMaterialOptions) {
  if (isUndefined(options) || isNull(options)) {
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

/**
 * @module EIGHT
 * @submodule materials
 */

function vertexShaderSrc(options?: MeshMaterialOptions): string {
  return builder(options).vertexShaderSrc()
}

function fragmentShaderSrc(options?: MeshMaterialOptions): string {
  return builder(options).fragmentShaderSrc()
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
   * @param options {MeshMaterialOptions}
   * @param engine {Engine}
   * @param level {number}
   */
  constructor(options: MeshMaterialOptions, engine: Engine, level: number) {
    super(
      vertexShaderSrc(options),
      fragmentShaderSrc(options),
      [],
      'MeshMaterial',
      engine,
      incLevel(level)
    )
    if (level === 0) {
      this.synchUp()
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    if (level === 0) {
      this.cleanUp()
    }
    super.destructor(incLevel(level))
  }

  // FIXME: destructor
}
