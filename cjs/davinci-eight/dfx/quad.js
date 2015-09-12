var expectArg = require('../checks/expectArg');
var Simplex = require('../dfx/Simplex');
var Symbolic = require('../core/Symbolic');
function quad(vecs, coords) {
    expectArg('vecs', vecs).toBeObject().toSatisfy(vecs.length === 4, "");
    expectArg('coords', coords).toBeObject().toSatisfy(coords.length === 4, "");
    var triangles = new Array();
    var t012 = new Simplex([vecs[0], vecs[1], vecs[2]]);
    Simplex.computeFaceNormals(t012);
    t012.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[0];
    t012.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[1];
    t012.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[2];
    triangles.push(t012);
    var t023 = new Simplex([vecs[0], vecs[2], vecs[3]]);
    Simplex.computeFaceNormals(t023);
    t023.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE] = t012.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE];
    t023.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE] = t012.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE];
    t023.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[3];
    triangles.push(t023);
    return triangles;
}
module.exports = quad;
