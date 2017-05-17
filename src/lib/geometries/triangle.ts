import { computeFaceNormals } from '../geometries/computeFaceNormals';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { VectorN } from '../atoms/VectorN';

export function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

    const simplex = new Simplex(SimplexMode.TRIANGLE);

    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = a;
    // simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e1
    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = b;
    // simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e2
    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = c;
    // simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e3

    computeFaceNormals(simplex, GraphicsProgramSymbols.ATTRIBUTE_POSITION, GraphicsProgramSymbols.ATTRIBUTE_NORMAL);

    Simplex.setAttributeValues(attributes, simplex);

    triangles.push(simplex);

    return triangles;
}
