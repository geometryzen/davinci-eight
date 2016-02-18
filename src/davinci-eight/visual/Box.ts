import BoxOptions from './BoxOptions'
import Color from '../core/Color'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import visualCache from './visualCache'
import VisualBody from './VisualBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Box
 * @extends RigidBody
 */
export default class Box extends VisualBody {
    constructor(options: BoxOptions = {}) {
        super(visualCache.box(options), visualCache.material(options), 'Box')
        this._geometry.release()
        this._material.release()
        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        this.color = Color.green
    }
    protected destructor(): void {
        super.destructor()
    }
    get width(): number {
        return this.getScaleX()
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this.setScaleX(width)
    }
    get height(): number {
        return this.getScaleY()
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this.setScaleY(height)
    }
    get depth(): number {
        return this.getScaleZ()
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this.setScaleZ(depth)
    }
}
