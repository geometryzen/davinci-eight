import R3 from '../math/R3'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import Primitive from '../core/Primitive'
import CylinderBuilder from './CylinderBuilder'
import Unit from '../math/Unit'
import VectorE3 from '../math/VectorE3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

// FIXME: Maybe we should have a constant for this use case?
const HALF = Unit.ONE.scale(0.5)

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(axis: VectorE3): Primitive[] {
    const builder = new CylinderBuilder(axis)
    builder.setPosition(R3.direction(axis).scale(HALF))
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
    constructor(axis: VectorE3) {
        super()
        const ps: Primitive[] = primitives(axis)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
