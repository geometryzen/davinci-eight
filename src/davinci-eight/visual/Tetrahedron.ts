import Mesh from '../core/Mesh'
import TetrahedronOptions from './TetrahedronOptions'
import visualCache from './visualCache'

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
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }
}
