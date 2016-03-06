import AbstractColor from '../core/AbstractColor'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'
import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * The options for creating a Sphere.
 *
 * @class SphereOptions
 * @extends VisualOptions
 */
interface SphereOptions extends VisualOptions {

  /**
   * @attribute color
   * @type AbstractColor
   * @optional
   */
  color?: AbstractColor

  /**
   * @attribute offset
   * @type VectorE3
   * @optional
   * @default 0
   */
  offset?: VectorE3

  /**
   * @attribute position
   * @type VectorE3
   * @optional
   * @default 0
   */
  position?: VectorE3

  /**
   * @attribute radius
   * @type number
   * @optional
   * @default 0.5
   */
  radius?: number

  scale?: VectorE3
  tilt?: SpinorE3
}

export default SphereOptions
