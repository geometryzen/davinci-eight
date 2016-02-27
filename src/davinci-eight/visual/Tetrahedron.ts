import Mesh from '../core/Mesh'
import mustBeNumber from '../checks/mustBeNumber';
import TetrahedronOptions from './TetrahedronOptions';
import visualCache from './visualCache';

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Tetrahedron
 * @extends Mesh
 */
export default class Tetrahedron extends Mesh {

    /**
     * @class Tetrahedron
     * @constructor
     * @param options {TetrahedronOptions}
     */
    constructor(options: TetrahedronOptions) {
        super('Tetrahedron')
        const geometry = visualCache.tetrahedron(options)
        const material = visualCache.material()
        this.geometry = geometry
        this.material = material
        geometry.release()
        material.release()
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
        return this.scale.x
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        this.scale.x = radius
        this.scale.y = radius
        this.scale.z = radius
    }
}
