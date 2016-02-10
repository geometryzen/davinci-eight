import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'
import VisualOptions from './VisualOptions'

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
    constructor(options: VisualOptions = {}) {
        super(visualCache.tetrahedron(options), visualCache.material(options), 'Tetrahedron')
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
