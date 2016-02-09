import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Tetrahedron
 * @extends RigidBody
 */
export default class Tetrahedron extends RigidBody {

    /**
     * @class Tetrahedron
     * @constructor
     */
    constructor() {
        super(visualCache.tetrahedron(), visualCache.program(), 'Tetrahedron')
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
