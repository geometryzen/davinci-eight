var expectArg = require('../checks/expectArg');
var Symbolic = require('../core/Symbolic');
var Vector3 = require('../math/Vector3');
var wedgeXY = require('../math/wedgeXY');
var wedgeYZ = require('../math/wedgeYZ');
var wedgeZX = require('../math/wedgeZX');
function computeFaceNormals(simplex) {
    // TODO: Optimize so that we don't create temporaries.
    // Use static functions on Vector3 to compute cross product by component.
    expectArg('simplex', simplex).toBeObject();
    expectArg('name', name).toBeString();
    // We're going to create a single Vector3 and share it across all vertices
    // so we create it now in order to to make use of the mutators.
    var vertex0 = simplex.vertices[0].attributes;
    var vertex1 = simplex.vertices[1].attributes;
    var vertex2 = simplex.vertices[2].attributes;
    var pos0 = vertex0[Symbolic.ATTRIBUTE_POSITION];
    var pos1 = vertex1[Symbolic.ATTRIBUTE_POSITION];
    var pos2 = vertex2[Symbolic.ATTRIBUTE_POSITION];
    var x0 = pos0.getComponent(0);
    var y0 = pos0.getComponent(1);
    var z0 = pos0.getComponent(2);
    var x1 = pos1.getComponent(0);
    var y1 = pos1.getComponent(1);
    var z1 = pos1.getComponent(2);
    var x2 = pos2.getComponent(0);
    var y2 = pos2.getComponent(1);
    var z2 = pos2.getComponent(2);
    var ax = x2 - x1;
    var ay = y2 - y1;
    var az = z2 - z1;
    var bx = x0 - x1;
    var by = y0 - y1;
    var bz = z0 - z1;
    var x = wedgeYZ(ax, ay, az, bx, by, bz);
    var y = wedgeZX(ax, ay, az, bx, by, bz);
    var z = wedgeXY(ax, ay, az, bx, by, bz);
    var normal = new Vector3([x, y, z]).normalize();
    vertex0[Symbolic.ATTRIBUTE_NORMAL] = normal;
    vertex1[Symbolic.ATTRIBUTE_NORMAL] = normal;
    vertex2[Symbolic.ATTRIBUTE_NORMAL] = normal;
}
module.exports = computeFaceNormals;
