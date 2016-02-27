import CylinderBuilder from './CylinderBuilder'
import mustBeObject from '../checks/mustBeObject'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import Primitive from '../core/Primitive'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(e: VectorE3, cutLine: VectorE3, clockwise: boolean, stress: VectorE3, tilt: SpinorE3, offset: VectorE3): Primitive[] {
    mustBeObject('stress', stress)
    mustBeObject('tile', tilt)
    mustBeObject('offset', offset)
    const builder = new CylinderBuilder(e, cutLine, clockwise)
    builder.openBottom = false
    builder.openTop = false
    builder.stress.copy(stress)
    builder.tilt.copy(tilt)
    builder.offset.copy(offset)
    return builder.toPrimitives()
}

/**
 * A convenience class for creating a Cylinder.
 *
 * @class CylinderGeometry
 * @extends GeometryContainer
 */
export default class CylinderGeometry extends GeometryContainer {
    /**
     * @class CylinderGeometry
     * @constructor
     * @param e {VectorE3}
     * @param cutLine {VectorE3}
     * @param clockwise {boolean}
     * @param stress {VectorE3}
     * @param tilt {SpinorE3}
     * @param offset {VectorE3}
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean, stress: VectorE3, tilt: SpinorE3, offset: VectorE3) {
        super()
        mustBeObject('stress', stress)
        mustBeObject('tile', tilt)
        mustBeObject('offset', offset)
        const ps: Primitive[] = primitives(e, cutLine, clockwise, stress, tilt, offset)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }
}
