import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import Primitive from '../core/Primitive'
import SphereBuilder from './SphereBuilder'
import R3 from '../math/R3'
import Simplex from './Simplex'
import isDefined from '../checks/isDefined'
import mustBeInteger from '../checks/mustBeInteger'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

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
    const builder = new SphereBuilder(1, R3.e2)
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
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(p))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
