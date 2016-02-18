import CartesianE3 from '../math/CartesianE3'
import GeometryContainer from '../core/GeometryContainer'
import GeometryPrimitive from '../core/GeometryPrimitive'
import Primitive from '../core/Primitive'
import CylinderBuilder from './CylinderBuilder'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new CylinderBuilder(CartesianE3.e2)
    builder.setPosition(CartesianE3.e2.scale(0.5))
    return builder.toPrimitives()
}

/**
 * A convenience class for creating a Cylinder.
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
