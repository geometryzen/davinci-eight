import direction from './direction'
import isDefined from '../checks/isDefined'
import MeshMaterial from '../materials/MeshMaterial'
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
     */
    constructor(options: SphereOptions = {}) {
        super('Sphere', direction(options))

        const geoOptions: SphereGeometryOptions = {}
        const geometry = new SphereGeometry(geoOptions)
        this.geometry = geometry
        geometry.release()
        const material = new MeshMaterial()
        this.material = material
        material.release()
        if (options.color) {
            this.color.copy(options.color)
        }
        if (options.position) {
            this.position.copyVector(options.position)
        }
        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    public destructor(): void {
        super.destructor()
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
