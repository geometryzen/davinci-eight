import deviation from './deviation'
import direction from './direction'
import CylinderOptions from './CylinderOptions'
import RigidBody from './RigidBody'
import Vector3 from '../math/Vector3'
import visualCache from './visualCache'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Cylinder
 * @extends RigidBody
 */
export default class Cylinder extends RigidBody {

    /**
     * @class Cylinder
     * @constructor
     * @param [options={}] {CylinderOptions}
     */
    constructor(options: CylinderOptions = {}) {
        super('Cylinder', direction(options))
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        const stress = Vector3.vector(1, 1, 1)
        const tilt = deviation(direction(options))
        // The options don't currently include an offset.
        const offset = Vector3.zero()

        const geometry = visualCache.cylinder(stress, tilt, offset)
        this.geometry = geometry
        geometry.release()

        const material = visualCache.material()
        this.material = material
        material.release()
    }


    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
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

    /**
     * @property radius
     * @type number
     */
    get radius() {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }
}
