import CartesianE3 from '../math/CartesianE3'
import Geometry from '../core/Geometry'
import Primitive from '../core/Primitive'
import CylinderBuilder from './CylinderBuilder'
import CylinderPrimitivesBuilder from './CylinderPrimitivesBuilder'

const e1 = CartesianE3.fromVectorE3({ x: 1, y: 0, z: 0 })
const e2 = CartesianE3.fromVectorE3({ x: 0, y: 1, z: 0 })
// const e3 = CartesianE3.fromVectorE3({ x: 0, y: 0, z: 1 })

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    if (false) {
        // This only builds the walls, but does use a TRIANGLE_STRIP
        const builder = new CylinderPrimitivesBuilder(e2, e1)
        return builder.toPrimitives()
    }
    else {
        // Conventional cylinder.
        const builder = new CylinderBuilder(e2)
        return builder.toPrimitives()
    }
}

/**
 * A convenience class for creating a cuboid.
 *
 * @class CylinderGeometry
 * @extends Geometry
 */
export default class CylinderGeometry extends Geometry {
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor() {
        super(primitives())
    }
}
