import mustBeNumber from '../checks/mustBeNumber';
import mustBeGE from '../checks/mustBeGE';
import visualCache from './visualCache';
import RigidBody from './RigidBody'
import VisualOptions from './VisualOptions'

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
     * @extends RigidBody
     */
    constructor(options: VisualOptions = {}) {
        super(visualCache.arrow(options), visualCache.material(options), 'Arrow')
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
