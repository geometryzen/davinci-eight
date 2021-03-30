import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { computeFaceNormals } from '../geometries/computeFaceNormals';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
/**
 * @hidden
 */
export function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    var simplex = new Simplex(SimplexMode.TRIANGLE);
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
