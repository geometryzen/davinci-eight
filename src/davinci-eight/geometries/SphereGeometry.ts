import GeometryContainer from '../core/GeometryContainer'
import GeometryPrimitive from '../core/GeometryPrimitive'
import Primitive from '../core/Primitive'
import SphereBuilder from './SphereBuilder'
import G3m from '../math/G3m'
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
    const builder = new SphereBuilder(1, G3m.e2)
    builder.k = k(options)
    return builder.toPrimitives()
}

/**
 * A convenience class for creating a sphere.
 *
 * @class SphereGeometry
 * @extends Geometry
 */
export default class SphereGeometry extends GeometryContainer {
    /**
     * @class SphereGeometry
     * @constructor
     */
    constructor(options: { k?: number } = {}) {
        super()
        const ps = primitives(options)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryPrimitive(p)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
