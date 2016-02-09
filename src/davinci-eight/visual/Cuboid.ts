import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Cuboid
 * @extends RigidBody
 */
export default class Cuboid extends RigidBody {
    constructor() {
        super(visualCache.cuboid(), visualCache.program(), 'Cuboid')
        this._buffers.release()
        this._program.release()
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
