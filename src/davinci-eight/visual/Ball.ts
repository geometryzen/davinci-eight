import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Ball
 * @extends RigidBody
 */
export default class Ball extends RigidBody {

    /**
     * @class Ball
     * @constructor
     */
    constructor() {
        super(visualCache.sphere(), visualCache.program(), 'Ball')
        this._buffers.release()
        this._program.release()
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
     * @default 1
     */
    get radius(): number {
        return this.getScaleX()
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        this.setScaleX(radius)
        this.setScaleY(radius)
        this.setScaleZ(radius)
    }
}
