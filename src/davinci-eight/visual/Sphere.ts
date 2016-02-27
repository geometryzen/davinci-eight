import deviation from './deviation'
import direction from './direction'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
import SphereOptions from './SphereOptions'
import visualCache from './visualCache'

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
        super(visualCache.sphere(options), visualCache.material(), 'Sphere', deviation(direction(options)), direction(options))
        this._geometry.release()
        this._material.release()
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
        return this.scale.x
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        this.scale.x = radius
        this.scale.y = radius
        this.scale.z = radius
    }
}
