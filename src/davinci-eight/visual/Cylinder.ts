import core from '../core'
import Euclidean3 from '../math/Euclidean3'
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import visualCache from './visualCache';
import VisualBody from './VisualBody'
import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Cylinder
 * @extends RigidBody
 */
export default class Cylinder extends VisualBody {

    /**
     * @class Cylinder
     * @constructor
     * @param [options]
     */
    constructor(options: VisualOptions = {}) {
        super(visualCache.cylinder(options), visualCache.material(options), 'Cylinder')
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
     * @property axis
     * @type Euclidean3
     */
    get axis(): Euclidean3 {
        const direction = Euclidean3.e2.rotate(this.modelFacet.R)
        return direction.scale(this.length)
    }
    set axis(axis: Euclidean3) {
        if (core.safemode) {
            mustBeObject('axis', axis)
        }
        this.modelFacet.R.rotorFromDirections(axis.direction(), Euclidean3.e2)
        this.length = axis.magnitude().α
    }

    /**
     * @property radius
     * @type number
     */
    get radius() {
        return this.getScaleX()
    }
    set radius(radius: number) {
        if (core.safemode) {
            mustBeNumber('radius', radius)
        }
        this.setScaleX(radius)
        this.setScaleZ(radius)
    }

    /**
     * @property length
     * @type number
     */
    get length() {
        return this.getScaleY();
    }
    set length(length: number) {
        if (core.safemode) {
            mustBeNumber('length', length)
        }
        this.setScaleY(length)
    }
}
