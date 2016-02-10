import Geometry from '../core/Geometry'
import Primitive from '../core/Primitive'
import SphereBuilder from './SphereBuilder'
import G3 from '../math/G3'
import Simplex from './Simplex'
import isDefined from '../checks/isDefined'
import mustBeInteger from '../checks/mustBeInteger'

function k(options: { k?: number }): number {
    if (isDefined(options.k)) {
        return mustBeInteger('k', options.k)
    }
    else {
        return Simplex.TRIANGLE
    }
}

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(options: { k?: number }): Primitive[] {
    const builder = new SphereBuilder(1, G3.e2)
    builder.k = k(options)
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
    constructor(options: { k?: number } = {}) {
        super(primitives(options))
    }
}
