import mustBeNumber from '../checks/mustBeNumber';
import mustBeGE from '../checks/mustBeGE';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

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
     * Provides a graphical representation of a vector.
     *
     * @example
     * 
     *     const arrow = new EIGHT.Arrow()
     *
     * In most cases, an Arrow will be used to represent a vector by placing the arrow
     * at a field or particle location using the position property. The tail of the
     * arrow is generally considered to be the position of the arrow.
     *
     *     arrow.X = particle.X
     *
     * The axis of the arrow
     *
     * @class Arrow
     * @constructor
     * @extends RigidBody
     */
    constructor() {
        super(visualCache.arrow(), visualCache.program(), 'Arrow')
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
     * @property length
     * @type number
     * @default 1
     */
    get length() {
        return this.getScaleY()
    }
    set length(length: number) {
        mustBeNumber('length', length)
        mustBeGE('length', length, 0)
        this.setScaleX(length)
        this.setScaleY(length)
        this.setScaleZ(length)
    }
}
