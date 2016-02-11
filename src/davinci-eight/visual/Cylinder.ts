import mustBeNumber from '../checks/mustBeNumber';
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
    constructor(options: VisualOptions = {}) {
        super(visualCache.cylinder(options), visualCache.material(options), 'Cylinder')
        this._geometry.release()
        this._material.release()
    }
    protected destructor(): void {
        super.destructor()
    }
    get radius() {
        return this.getScaleX()
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        this.setScaleX(radius)
        this.setScaleZ(radius)
    }
    get length() {
        return this.getScaleY();
    }
    set length(length: number) {
        mustBeNumber('length', length)
        this.setScaleY(length)
    }
}
