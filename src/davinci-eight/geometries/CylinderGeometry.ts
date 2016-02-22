import R3 from '../math/R3'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import Primitive from '../core/Primitive'
import CylinderBuilder from './CylinderBuilder'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new CylinderBuilder(R3.e2)
    builder.setPosition(R3.e2.scale(0.5))
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
        const ps: Primitive[] = primitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
