import GeometryContainer from '../core/GeometryContainer';
import GeometryBuffers from '../core/GeometryBuffers';
import Primitive from '../core/Primitive';
import ArrowBuilder from './ArrowBuilder';
import R3 from '../math/R3';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new ArrowBuilder(R3.e2)
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
     */
    constructor() {
        super()
        const ps = primitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
