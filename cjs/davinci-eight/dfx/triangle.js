var computeFaceNormals = require('../dfx/computeFaceNormals');
var expectArg = require('../checks/expectArg');
var Simplex = require('../dfx/Simplex');
var Symbolic = require('../core/Symbolic');
var VectorN = require('../math/VectorN');
function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    var simplex = new Simplex(Simplex.K_FOR_TRIANGLE);
    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = c;
    computeFaceNormals(simplex, Symbolic.ATTRIBUTE_POSITION, Symbolic.ATTRIBUTE_NORMAL);
    Simplex.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
}
module.exports = triangle;
