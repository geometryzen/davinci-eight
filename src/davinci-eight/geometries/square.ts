import Simplex from '../geometries/Simplex';
import quadrilateral from '../geometries/quadrilateral';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R2m from '../math/R2m';
import R3m from '../math/R3m';
import VectorN from '../math/VectorN';

// square
//
//  b-------a
//  |       | 
//  |       |
//  |       |
//  c-------d
//
export default function square(size = 1): Simplex[] {

    let s = size / 2;

    let vec0 = new R3m([+s, +s, 0]);
    let vec1 = new R3m([-s, +s, 0]);
    let vec2 = new R3m([-s, -s, 0]);
    let vec3 = new R3m([+s, -s, 0]);

    let c00 = new R2m([0, 0]);
    let c01 = new R2m([0, 1]);
    let c10 = new R2m([1, 0]);
    let c11 = new R2m([1, 1]);

    let coords: R2m[] = [c11, c01, c00, c10];

    let attributes: { [name: string]: VectorN<number>[] } = {};

    attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = coords;

    return quadrilateral(vec0, vec1, vec2, vec3, attributes);
}
