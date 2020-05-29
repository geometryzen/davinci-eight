"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeFaceNormals = void 0;
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector3_1 = require("../math/Vector3");
var wedgeXY_1 = require("../math/wedgeXY");
var wedgeYZ_1 = require("../math/wedgeYZ");
var wedgeZX_1 = require("../math/wedgeZX");
function computeFaceNormals(simplex, positionName, normalName) {
    if (positionName === void 0) { positionName = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION; }
    if (normalName === void 0) { normalName = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL; }
    var vertex0 = simplex.vertices[0].attributes;
    var vertex1 = simplex.vertices[1].attributes;
    var vertex2 = simplex.vertices[2].attributes;
    var pos0 = vertex0[positionName];
    var pos1 = vertex1[positionName];
    var pos2 = vertex2[positionName];
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
    var x = wedgeYZ_1.wedgeYZ(ax, ay, az, bx, by, bz);
    var y = wedgeZX_1.wedgeZX(ax, ay, az, bx, by, bz);
    var z = wedgeXY_1.wedgeXY(ax, ay, az, bx, by, bz);
    var normal = new Vector3_1.Vector3([x, y, z]).normalize();
    vertex0[normalName] = normal;
    vertex1[normalName] = normal;
    vertex2[normalName] = normal;
}
exports.computeFaceNormals = computeFaceNormals;
