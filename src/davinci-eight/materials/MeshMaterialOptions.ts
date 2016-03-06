import MaterialOptions from './MaterialOptions'

/**
 * @module EIGHT
 * @submodule materials
 */

/**
 * @class MeshMaterialOptions
 * @extends MaterialOptions
 */
interface MeshMaterialOptions extends MaterialOptions {

  /**
   * @attribute attributes
   * @type {[name: string]: number}
   * @optional
   */
  attributes?: { [name: string]: number }

  /**
   * @attribute uniforms
   * @type {[name: string]: string}
   * @optional
   */
  uniforms?: { [name: string]: string }
}

export default MeshMaterialOptions
