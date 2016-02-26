import ArrowOptions from './ArrowOptions'
import deviation from './deviation'
import direction from './direction'
import Geometry from '../core/Geometry'
import Material from '../core/Material'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'
import Vector3 from '../math/Vector3'
import visualCache from './visualCache'

/**
 * @module EIGHT
 * @submodule visual
 */



/**
 * @class Arrow
 * @extends Mesh
 */
export default class Arrow extends RigidBody {

    /**
     * @class Arrow
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param tilt {SpinorE3}
     * @param initialDirection {SpinorE3}
     */
    constructor(geometry: Geometry, material: Material, tilt: SpinorE3, initialDirection: VectorE3) {
        super(geometry, material, 'Arrow', tilt, initialDirection)
    }

    /**
     * @method create
     * @param [options={}] {ArrowOptions}
     * @return Arrow
     */
    public static create(options: ArrowOptions = {}): Arrow {
        const initialDirection = direction(options)
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        const stress = Vector3.vector(1, 1, 1)
        const tilt = deviation(direction(options))
        // The options don't currently include an offset.
        const offset = Vector3.zero()
        const geometry = visualCache.arrow(stress, tilt, offset)
        const material = visualCache.material()
        const arrow = new Arrow(geometry, material, tilt, initialDirection)
        geometry.release()
        material.release()
        return arrow;
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
        return this.scale.y
    }
    set length(length: number) {
        mustBeNumber('length', length)
        mustBeGE('length', length, 0)
        this.scale.x = length
        this.scale.y = length
        this.scale.z = length
    }
}
