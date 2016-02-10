import CartesianE3 from '../math/CartesianE3'
import GeometryContainer from '../core/GeometryContainer'
import GeometryPrimitive from '../core/GeometryPrimitive'
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
 * @extends GeometryContainer
 */
export default class CylinderGeometry extends GeometryContainer {
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor() {
        super()
        const ps = primitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryPrimitive(dataSource)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
