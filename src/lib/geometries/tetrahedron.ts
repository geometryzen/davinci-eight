import { expectArg } from "../checks/expectArg";
import { Simplex } from "../geometries/Simplex";
import { triangle } from "../geometries/triangle";
import { VectorN } from "../math/VectorN";

/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {
    expectArg("a", a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg("b", b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
    expectArg("c", c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
    expectArg("d", d).toSatisfy(d instanceof VectorN, "d must be a VectorN");

    const triatts: { [name: string]: VectorN<number>[] } = {};
    const points = [a, b, c, d];
    const faces: Simplex[] = [];

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
