import deviation from './deviation'
import direction from './direction'
import CylinderOptions from './CylinderOptions'
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
 * @class Cylinder
 * @extends Mesh
 */
export default class Cylinder extends RigidBody {

    /**
     * @class Cylinder
     * @constructor
     */
    constructor(geometry: Geometry, material: Material, tilt: SpinorE3, initialDirection: VectorE3) {
        super(geometry, material, 'Cylinder', tilt, initialDirection)
    }

    /**
     * @method create
     * @param [options={}] {CylinderOptions}
     * @return Cylinder
     */
    public static create(options: CylinderOptions = {}): Cylinder {
        const initialDirection = direction(options)
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        const stress = Vector3.vector(1, 1, 1)
        const tilt = deviation(direction(options))
        // The options don't currently include an offset.
        const offset = Vector3.zero()
        const geometry = visualCache.cylinder(stress, tilt, offset)
        const material = visualCache.material()
        const cylinder = new Cylinder(geometry, material, tilt, initialDirection)
        geometry.release()
        material.release()
        return cylinder;
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
     * @property radius
     * @type number
     */
    get radius() {
        return this.scale.x
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        mustBeGE('radius', radius, 0)
        this.scale.x = radius
        this.scale.z = radius
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
        this.scale.y = length
    }
}
