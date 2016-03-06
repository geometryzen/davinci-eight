import GeometryContainer from '../core/GeometryContainer';
import GeometryElements from '../core/GeometryElements';
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber';
import PolyhedronBuilder from '../geometries/PolyhedronBuilder';
import TetrahedronGeometryOptions from './TetrahedronGeometryOptions'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

const vertices = [
    1, 1, 1, - 1, - 1, 1, - 1, 1, - 1, 1, - 1, - 1
];

const indices = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];

/**
 * A convenience class for creating a tetrahedron geometry.
 *
 * @class TetrahedronGeometry
 * @extends Geometry
 */
export default class TetrahedronGeometry extends GeometryContainer {
    /**
     * @class TetrahedronGeometry
     * @constructor
     * @param [options = {}] {TetrahedronGeometryOptions}
     */
    constructor(options: TetrahedronGeometryOptions = {}) {
        super('TetrahedronGeometry', options.tilt)
        const radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0
        const builder = new PolyhedronBuilder(vertices, indices, radius)
        const ps = builder.toPrimitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryElements(vertexArraysFromPrimitive(p), options.engine)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
