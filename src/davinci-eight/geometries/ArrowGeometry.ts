import ArrowBuilder from './ArrowBuilder'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import isDefined from '../checks/isDefined'
import mustBeObject from '../checks/mustBeObject'
import R3 from '../math/R3'
import SpinorE3 from '../math/SpinorE3'
import Spinor3 from '../math/Spinor3'
import VectorE3 from '../math/VectorE3'
import Vector3 from '../math/Vector3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * A convenience class for creating an arrow.
 *
 * @class ArrowGeometry
 * @extends Geometry
 * @deprecated Moving towards the GeometryBuilder architecture and ArrowBuilder.
 */
export default class ArrowGeometry extends GeometryContainer {

    /**
     * @class ArrowGeometry
     * @constructor
     * @param [options = {}] {} The initial axis of the arrow.
     */
    constructor(options: { stress?: VectorE3; tilt?: SpinorE3; offset?: VectorE3 } = {}) {
        super('ArrowGeometry')
        mustBeObject('options', options)

        const builder = new ArrowBuilder(R3.e2, R3.e3, false)
        builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1))
        builder.tilt.copy(isDefined(options.tilt) ? options.tilt : Spinor3.one())
        builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero())
        const ps = builder.toPrimitives()

        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        return this.scaling.getElement(0, 0)
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
