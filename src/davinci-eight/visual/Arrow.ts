import ArrowOptions from './ArrowOptions'
import deviation from './deviation'
import direction from './direction'
import mustBeGE from '../checks/mustBeGE'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
import visualCache from './visualCache';

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
     * @param [options={}] {ArrowOptions}
     */
    constructor(options: ArrowOptions = {}) {
        super(visualCache.arrow(direction(options)), visualCache.material(), 'Arrow', deviation(direction(options)), direction(options))
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
