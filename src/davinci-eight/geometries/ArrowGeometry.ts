import GeometryContainer from '../core/GeometryContainer';
import GeometryBuffers from '../core/GeometryBuffers';
import mustBeObject from '../checks/mustBeObject';
import Primitive from '../core/Primitive';
import ArrowBuilder from './ArrowBuilder';
import ArrowConfig from './ArrowConfig';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(config: ArrowConfig): Primitive[] {
    mustBeObject('config', config)
    const builder = new ArrowBuilder()
    builder.stress.copy(config.stress)
    builder.tilt.copy(config.tilt)
    builder.offset.copy(config.offset)
    return builder.toPrimitives()
}

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
     * @param config {ArrowConfig} The initial axis of the arrow.
     */
    constructor(config: ArrowConfig) {
        super()
        mustBeObject('config', config)
        const ps = primitives(config)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
