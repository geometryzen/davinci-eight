import Geometry from '../core/Geometry';
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
export default class ArrowGeometry extends Geometry {
    /**
     * @class ArrowGeometry
     * @constructor
     */
    constructor() {
        super(primitives())
    }
}
