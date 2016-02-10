import GeometryContainer from '../core/GeometryContainer';
import GeometryPrimitive from '../core/GeometryPrimitive';
import Primitive from '../core/Primitive';
import ArrowBuilder from './ArrowBuilder';
import G3 from '../math/G3';

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new ArrowBuilder(G3.e2)
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
            const geometry = new GeometryPrimitive(dataSource)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
