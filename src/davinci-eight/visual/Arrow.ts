import Euclidean3 from '../math/Euclidean3';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeGE from '../checks/mustBeGE';
import visualCache from './visualCache';
import VisualBody from './VisualBody'
import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Arrow
 * @extends VisualBody
 */
export default class Arrow extends VisualBody {

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

    get axis(): Euclidean3 {
        const direction = Euclidean3.e2.rotate(this.modelFacet.R)
        return direction.scale(this.length)
    }
    set axis(axis: Euclidean3) {
        mustBeObject('axis', axis)
        this.modelFacet.R.rotorFromDirections(axis.direction(), Euclidean3.e2)
        this.length = axis.magnitude().α
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
