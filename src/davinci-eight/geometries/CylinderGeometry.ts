import Geometry from '../core/Geometry';
import Primitive from '../core/Primitive';
import CylinderBuilder from './CylinderBuilder';

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new CylinderBuilder()
    return builder.toPrimitives()
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
