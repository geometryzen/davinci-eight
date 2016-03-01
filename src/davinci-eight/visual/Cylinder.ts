import direction from './direction'
import CylinderGeometry from '../geometries/CylinderGeometry'
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions'
import CylinderOptions from './CylinderOptions'
import isDefined from '../checks/isDefined'
import MeshMaterial from '../materials/MeshMaterial'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Cylinder
 * @extends RigidBody
 */
export default class Cylinder extends RigidBody {

    /**
     * @class Cylinder
     * @constructor
     * @param [options] {CylinderOptions}
     */
    constructor(options: CylinderOptions = {}) {
        super('Cylinder', direction(options))
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: CylinderGeometryOptions = {}
        geoOptions.tilt = options.tilt
        geoOptions.offset = options.offset
        geoOptions.openCap = options.openCap
        geoOptions.openBase = options.openBase
        geoOptions.openWall = options.openWall
        const geometry = new CylinderGeometry(geoOptions)
        this.geometry = geometry
        geometry.release()

        const material = new MeshMaterial()
        this.material = material
        material.release()

        if (options.color) {
            this.color.copy(options.color)
        }
        if (options.position) {
            this.position.copyVector(options.position)
        }
        if (options.attitude) {
            this.attitude.copySpinor(options.attitude)
        }
        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        this.length = isDefined(options.length) ? mustBeNumber('length', options.length) : 1.0
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

    /**
     * @property radius
     * @type number
     */
    get radius() {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }
}
