import direction from './direction'
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
        super('Sphere', direction(options))
        const geometry = visualCache.sphere(options)
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
