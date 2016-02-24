import GeometryContainer from '../core/GeometryContainer';
import GeometryBuffers from '../core/GeometryBuffers';
import Primitive from '../core/Primitive';
import ArrowBuilder from './ArrowBuilder';
import VectorE3 from '../math/VectorE3';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(axis: VectorE3): Primitive[] {
    const builder = new ArrowBuilder(axis)
    return builder.toPrimitives()
}

/**
 * A convenience class for creating an arrow.
 *
 * @class ArrowGeometry
 * @extends Geometry
 */
export default class ArrowGeometry extends GeometryContainer {
    /**
     * @class ArrowGeometry
     * @constructor
     * @param axis {VectorE3} The initial axis of the arrow.
     */
    constructor(axis: VectorE3) {
        super()
        const ps = primitives(axis)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
