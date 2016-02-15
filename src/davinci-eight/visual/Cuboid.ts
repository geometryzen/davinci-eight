import Color from '../core/Color'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import visualCache from './visualCache'
import VisualBody from './VisualBody'
import CuboidOptions from './CuboidOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Cuboid
 * @extends RigidBody
 */
export default class Cuboid extends VisualBody {
    constructor(options: CuboidOptions = {}) {
        super(visualCache.cuboid(options), visualCache.material(options), 'Cuboid')
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
