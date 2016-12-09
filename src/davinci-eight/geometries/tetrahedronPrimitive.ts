import isDefined from '../checks/isDefined';
import mustBeNumber from '../checks/mustBeNumber';
import PolyhedronBuilder from '../geometries/PolyhedronBuilder';
import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';
import TetrahedronGeometryOptions from './TetrahedronGeometryOptions';

//
// Imagine 4 vertices sitting on some of the vertices of a cube of side-length 2.
// The vertices are:
// [0] (+1, +1, +1)
// [1] (-1, -1, +1)
// [2] (-1, +1, -1)
// [3] (+1, -1, -1)
//
// This is seen to form a tetrahedron because all of the side lengths are
// the same, sqrt(8), because the side length of the cube is 2. So we have
// four equilateral triangles stiched together to form a tetrahedron.
//
const vertices: number[] = [
    +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
];

//
// The following 12 indices comprise four triangles.
// Each triangle is traversed counter-clockwise as seen from the outside. 
//
const indices: number[] = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];

export default function tetrahedronPrimitive(options: TetrahedronGeometryOptions = { kind: 'TetrahedronGeometry' }): Primitive {
    const radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0;
    const builder = new PolyhedronBuilder(vertices, indices, radius);
    return reduce(builder.toPrimitives());
}
