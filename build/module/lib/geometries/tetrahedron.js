import { expectArg } from '../checks/expectArg';
import { triangle } from '../geometries/triangle';
import { VectorN } from '../math/VectorN';
/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 * @hidden
 */
export function tetrahedron(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
    expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
    expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");
    var triatts = {};
    var points = [a, b, c, d];
    var faces = [];
    triangle(points[0], points[1], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle(points[1], points[3], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle(points[2], points[3], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle(points[3], points[1], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    return triangles;
}
