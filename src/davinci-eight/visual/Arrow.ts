import ArrowOptions from './ArrowOptions'
import deviation from './deviation'
import direction from './direction'
import RigidBody from './RigidBody'
import Vector3 from '../math/Vector3'
import visualCache from './visualCache'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Arrow
 * @extends RigidBody
 */
export default class Arrow extends RigidBody {

    /**
     * @class Arrow
     * @constructor
     * @param [options={}] {ArrowOptions}
     */
    constructor(options: ArrowOptions = {}) {
        super('Arrow', direction(options))
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        const stress = Vector3.vector(1, 1, 1)
        const tilt = deviation(direction(options))
        // The options don't currently include an offset.
        const offset = Vector3.zero()
        const geometry = visualCache.arrow(stress, tilt, offset)
        const material = visualCache.material()
        this.geometry = geometry
        this.material = material
        geometry.release()
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
}
