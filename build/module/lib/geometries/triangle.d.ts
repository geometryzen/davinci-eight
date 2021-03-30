import { VectorN } from '../atoms/VectorN';
import { Simplex } from '../geometries/Simplex';
/**
 * @hidden
 */
export declare function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: {
    [name: string]: VectorN<number>[];
}, triangles?: Simplex[]): Simplex[];
