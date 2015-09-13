var expectArg = require('../checks/expectArg');
var triangle = require('../dfx/triangle');
var VectorN = require('../math/VectorN');
function setAttributes(which, source, target) {
    var names = Object.keys(source);
    var namesLength = names.length;
    var i;
    var name;
    var values;
    for (i = 0; i < namesLength; i++) {
        name = names[i];
        values = source[name];
        target[name] = which.map(function (index) { return values[index]; });
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
function quadrilateral(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
    expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
    expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
    expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");
    var triatts = {};
    setAttributes([1, 2, 0], attributes, triatts);
    triangle(b, c, a, triatts, triangles);
    var face1 = triangles[triangles.length - 1];
    setAttributes([3, 0, 2], attributes, triatts);
    triangle(d, a, c, triatts, triangles);
    var face2 = triangles[triangles.length - 1];
    face1.vertices[0].opposing.push(face2);
    face2.vertices[0].opposing.push(face1);
    return triangles;
}
module.exports = quadrilateral;
