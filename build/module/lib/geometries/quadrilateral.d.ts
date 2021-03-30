import { VectorN } from '../atoms/VectorN';
import { Simplex } from '../geometries/Simplex';
/**
 * quadrilateral
 *
 *  b-------a
 *  |       |
 *  |       |
 *  |       |
 *  c-------d
 *
 * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 * @hidden
 */
export declare function quadrilateral(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
    [name: string]: VectorN<number>[];
}, triangles?: Simplex[]): Simplex[];
