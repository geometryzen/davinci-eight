import core from '../core'
import G3 from '../math/G3'
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
     * @type G3
     */
    get axis(): G3 {
        const direction = G3.e2.rotate(this.attitude)
        return direction.scale(this.length)
    }
    set axis(axis: G3) {
        if (core.safemode) {
            mustBeObject('axis', axis)
        }
        this.attitude.rotorFromDirections(G3.e2, axis.direction())
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
