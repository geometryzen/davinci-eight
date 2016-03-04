import ArrowOptions from './ArrowOptions'
import ArrowGeometry from '../geometries/ArrowGeometry'
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions'
import direction from './direction'
import MeshMaterial from '../materials/MeshMaterial'
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Arrow
 * @extends RigidBody
 */
export default class Arrow extends RigidBody {

    /**
     * @class Arrow
     * @constructor
     * @param [options] {ArrowOptions}
     */
    constructor(options: ArrowOptions = {}) {
        super('Arrow', direction(options))
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: ArrowGeometryOptions = {}
        const geometry = new ArrowGeometry(geoOptions)

        const material = new MeshMaterial()

        this.geometry = geometry
        this.material = material

        geometry.release()
        material.release()

        if (options.color) {
            this.color.copy(options.color)
        }
        if (options.position) {
            this.position.copyVector(options.position)
        }
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
     * @property length
     * @type number
     * @default 1
     */
    get length() {
        return this.getPrincipalScale('length')
    }
    set length(length: number) {
        this.setPrincipalScale('length', length)
    }
}
