import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import notSupported from '../i18n/notSupported'
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
    const builder = new SphereBuilder()
    // We know that the standard configuration is for a sphere of radius 1,
    // at the origin, with a spherical polar axis aligned with e3, and the
    // azimuth aligned with e1.
    // FIXME: The scale, tilt, offset should be parameters.
    builder.tilt.rotorFromDirections(R3.e3, R3.e2)
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
        super('SphereGeometry')
        const ps = primitives(options)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(p))
            this.addPart(geometry)
            geometry.release()
        }
    }

    /**
     * @property radius
     * @type {number}
     */
    get radius(): number {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        switch (name) {
            case 'radius': {
                return this.scaling.getElement(0, 0)
            }
                break
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    setPrincipalScale(name: string, value: number): void {
        this.scaling.setElement(0, 0, value)
        this.scaling.setElement(1, 1, value)
        this.scaling.setElement(2, 2, value)
    }
}
