import BoxOptions from './BoxOptions'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import visualCache from './visualCache'
import Mesh from '../core/Mesh'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Box
 * @extends Mesh
 */
export default class Box extends Mesh {

    /**
     * @class Box
     * @constructor
     * @param [options={}] {BoxOptions}
     */
    constructor(options: BoxOptions = {}) {
        super(visualCache.box(), visualCache.material(), 'Box')
        this._geometry.release()
        this._material.release()
        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
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
     * @property width
     * @type number
     */
    get width(): number {
        return this.scale.x
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this.scale.x = width
    }

    /**
     * @property height
     * @type number
     */
    get height(): number {
        return this.scale.y
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this.scale.y = height
    }

    /**
     * @property depth
     * @type number
     */
    get depth(): number {
        return this.scale.z
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this.scale.z = depth
    }
}
