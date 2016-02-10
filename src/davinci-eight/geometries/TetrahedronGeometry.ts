import GeometryContainer from '../core/GeometryContainer';
import GeometryPrimitive from '../core/GeometryPrimitive';
import Primitive from '../core/Primitive';
import mustBeNumber from '../checks/mustBeNumber';
import PolyhedronBuilder from '../geometries/PolyhedronBuilder';

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

function primitives(radius: number): Primitive[] {
    mustBeNumber('radius', radius)
    const builder = new PolyhedronBuilder(vertices, indices, radius)
    return builder.toPrimitives()
}

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
     * @param [radius = 1] {number}
     */
    constructor(radius = 1) {
        super()
        const ps = primitives(radius)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryPrimitive(p)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
