import Simplex = require('../geometries/Simplex');
import VectorN = require('../math/VectorN');
/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 */
declare function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
    [name: string]: VectorN<number>[];
}, triangles?: Simplex[]): Simplex[];
export = tetrahedron;
