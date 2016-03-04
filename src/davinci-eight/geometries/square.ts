import Simplex from '../geometries/Simplex';
import quadrilateral from '../geometries/quadrilateral';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
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

    let vec0 = new Vector3([+s, +s, 0]);
    let vec1 = new Vector3([-s, +s, 0]);
    let vec2 = new Vector3([-s, -s, 0]);
    let vec3 = new Vector3([+s, -s, 0]);

    let c00 = new Vector2([0, 0]);
    let c01 = new Vector2([0, 1]);
    let c10 = new Vector2([1, 0]);
    let c11 = new Vector2([1, 1]);

    let coords: Vector2[] = [c11, c01, c00, c10];

    let attributes: { [name: string]: VectorN<number>[] } = {};

    attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = coords;

    return quadrilateral(vec0, vec1, vec2, vec3, attributes);
}
