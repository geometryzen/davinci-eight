import Simplex = require('../geometries/Simplex');
import VectorN = require('../math/VectorN');
declare function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: {
    [name: string]: VectorN<number>[];
}, triangles?: Simplex[]): Simplex[];
export = triangle;
