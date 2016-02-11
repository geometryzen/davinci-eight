import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import VisualBody from './VisualBody'
import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Sphere
 * @extends VisualBody
 */
export default class Sphere extends VisualBody {

    /**
     * @class Sphere
     * @constructor
     */
    constructor(options: VisualOptions = {}) {
        super(visualCache.sphere(options), visualCache.material(options), 'Sphere')
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
