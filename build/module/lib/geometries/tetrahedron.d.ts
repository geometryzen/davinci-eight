import { Simplex } from '../geometries/Simplex';
import { VectorN } from '../math/VectorN';
/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 * @hidden
 */
export declare function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
    [name: string]: VectorN<number>[];
}, triangles?: Simplex[]): Simplex[];
