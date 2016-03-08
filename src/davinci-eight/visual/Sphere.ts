import direction from './direction'
import incLevel from '../base/incLevel'
import isDefined from '../checks/isDefined'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
import SphereOptions from './SphereOptions'
import SphereGeometry from '../geometries/SphereGeometry'
import SphereGeometryOptions from '../geometries/SphereGeometryOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Sphere
 * @extends RigidBody
 */
export default class Sphere extends RigidBody {

  /**
   * @class Sphere
   * @constructor
   * @param [options] {SphereOptions}
   * @param [level = 0] {number}
   */
  constructor(options: SphereOptions = {}, level = 0) {
    super('Sphere', direction(options), incLevel(level))

    const geoOptions: SphereGeometryOptions = {}
    geoOptions.engine = options.engine
    const geometry = new SphereGeometry(geoOptions)
    this.geometry = geometry
    geometry.release()

    const matOptions: MeshMaterialOptions = void 0
    const material = new MeshMaterial(matOptions, options.engine, 0)
    this.material = material
    material.release()

    if (options.color) {
      this.color.copy(options.color)
    }
    if (options.position) {
      this.position.copyVector(options.position)
    }
    this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0
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
  public destructor(level: number): void {
    if (level === 0) {
      this.cleanUp()
    }
    super.destructor(incLevel(level))
  }

  /**
   * @property radius
   * @type number
   * @default 1
   */
  get radius(): number {
    return this.getPrincipalScale('radius')
  }
  set radius(radius: number) {
    this.setPrincipalScale('radius', radius)
  }
}
