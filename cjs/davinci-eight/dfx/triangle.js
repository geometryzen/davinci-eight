var computeFaceNormals = require('../dfx/computeFaceNormals');
var expectArg = require('../checks/expectArg');
var Simplex = require('../dfx/Simplex');
function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    expectArg('a', a).toBeObject();
    expectArg('b', b).toBeObject();
    expectArg('b', c).toBeObject();
    var simplex = new Simplex([a, b, c]);
    computeFaceNormals(simplex);
    Simplex.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
}
module.exports = triangle;
