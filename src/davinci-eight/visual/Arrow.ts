import ArrowOptions from './ArrowOptions'
import ArrowGeometry from '../geometries/ArrowGeometry'
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions'
import direction from './direction'
import incLevel from '../base/incLevel';
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * A <code>RigidBody</code> that may be used to represent a vector quantity.
 *
 * @example
 *     // Construct the arrow at any time and add it to the scene.
 *     const arrow = new EIGHT.Arrow({color: white})
 *     scene.add(arrow)
 *
 *     // Update the arrow configuration, usually inside the animation function.
 *     arrow.position = ...
 *     arrow.axis = ...
 *     arrow.length = ...
 *
 *     // Release the arrow when no longer required.
 *     arrow.release()
 *
 * @class Arrow
 * @extends RigidBody
 */
export default class Arrow extends RigidBody {

  /**
   * @class Arrow
   * @constructor
   * @param [options] {ArrowOptions}
   */
  constructor(options: ArrowOptions = {}) {
    super(void 0, void 0, options.engine, direction(options))
    this.setLoggingName('Arrow')
    // The shape is created un-stressed and then parameters drive the scaling.
    // The scaling matrix takes into account the initial tilt from the standard configuration.
    // const stress = Vector3.vector(1, 1, 1)

    const geoOptions: ArrowGeometryOptions = {}
    geoOptions.engine = options.engine
    const geometry = new ArrowGeometry(geoOptions)

    const matOptions: MeshMaterialOptions = void 0
    const material = new MeshMaterial(matOptions, options.engine)

    this.geometry = geometry
    this.material = material

    geometry.release()
    material.release()

    if (options.color) {
      this.color.copy(options.color)
    }
    if (options.position) {
      this.position.copyVector(options.position)
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }

  /**
   * @property length
   * @type number
   * @default 1
   */
  get length() {
    return this.getPrincipalScale('length')
  }
  set length(length: number) {
    this.setPrincipalScale('length', length)
  }
}
