import { Simplex } from '../geometries/Simplex';
import { triangle } from '../geometries/triangle';
import { VectorN } from '../atoms/VectorN';

function setAttributes(which: number[], source: { [name: string]: VectorN<number>[] }, target: { [name: string]: VectorN<number>[] }) {
    let names: string[] = Object.keys(source);
    let namesLength: number = names.length;
    let i: number;
    var name: string;
    var values: VectorN<number>[];
    for (i = 0; i < namesLength; i++) {
        name = names[i];
        values = source[name];
        target[name] = which.map(function (index: number) { return values[index]; });
    }
}

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
 */
export function quadrilateral(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

    const triatts: { [name: string]: VectorN<number>[] } = {};

    setAttributes([1, 2, 0], attributes, triatts);
    triangle(b, c, a, triatts, triangles);

    setAttributes([3, 0, 2], attributes, triatts);
    triangle(d, a, c, triatts, triangles);

    return triangles;
}
