import deviation from './deviation'
import direction from './direction'
import CylinderOptions from './CylinderOptions'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
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
    constructor(options: CylinderOptions = {}) {
        super(visualCache.cylinder(direction(options)), visualCache.material(), 'Cylinder', deviation(direction(options)), direction(options))
        this._geometry.release()
        this._material.release()
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
