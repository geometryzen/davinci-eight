import Geometry from '../core/Geometry';
import Primitive from '../core/Primitive';
import SphereBuilder from './SphereBuilder';
import G3 from '../math/G3';

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(): Primitive[] {
    const builder = new SphereBuilder(1, G3.e2)
    return builder.toPrimitives()
}

/**
 * A convenience class for creating a sphere.
 *
 * @class SphereGeometry
 * @extends Geometry
 */
export default class SphereGeometry extends Geometry {
    /**
     * @class SphereGeometry
     * @constructor
     */
    constructor() {
        super(primitives())
    }
}
