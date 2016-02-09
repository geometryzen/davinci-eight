import computeFaceNormals from '../geometries/computeFaceNormals';
import expectArg from '../checks/expectArg';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import VectorN from '../math/VectorN';

export default function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

    expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");

    let simplex = new Simplex(Simplex.TRIANGLE);

    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = a;
    // simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.e1
    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = b;
    // simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.e2
    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = c;
    // simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.e3

    computeFaceNormals(simplex, GraphicsProgramSymbols.ATTRIBUTE_POSITION, GraphicsProgramSymbols.ATTRIBUTE_NORMAL);

    Simplex.setAttributeValues(attributes, simplex);

    triangles.push(simplex);

    return triangles;
}
