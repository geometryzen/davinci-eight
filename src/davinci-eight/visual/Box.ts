import deviation from './deviation'
import direction from './direction'
import BoxOptions from './BoxOptions'
import RigidBody from './RigidBody'
import Vector3 from '../math/Vector3'
import visualCache from './visualCache'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Box
 * @extends RigidBody
 */
export default class Box extends RigidBody {

    /**
     * @class Box
     * @constructor
     * @param [options={}] {BoxOptions}
     */
    constructor(options: BoxOptions = {}) {
        super('Box', direction(options))
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        const stress = Vector3.vector(1, 1, 1)
        const tilt = deviation(direction(options))
        // The options don't currently include an offset.
        const offset = Vector3.zero()

        const geometry = visualCache.box(stress, tilt, offset, options)
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
     * @property width
     * @type number
     * @default 1
     */
    get width() {
        return this.getPrincipalScale('width')
    }
    set width(width: number) {
        this.setPrincipalScale('width', width)
    }

    /**
     * @property height
     * @type number
     */
    get height() {
        return this.getPrincipalScale('height')
    }
    set height(height: number) {
        this.setPrincipalScale('height', height)
    }

    /**
     * @property depth
     * @type number
     */
    get depth() {
        return this.getPrincipalScale('depth')
    }
    set depth(depth: number) {
        this.setPrincipalScale('depth', depth)
    }
}
