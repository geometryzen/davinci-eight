import MaterialOptions from './MaterialOptions'

/**
 * @module EIGHT
 * @submodule materials
 */

/**
 * @class PointMaterialOptions
 * @extends MaterialOptions
 */
interface PointMaterialOptions extends MaterialOptions {

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

export default PointMaterialOptions
