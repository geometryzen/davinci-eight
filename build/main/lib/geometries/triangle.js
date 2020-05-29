"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triangle = void 0;
var computeFaceNormals_1 = require("../geometries/computeFaceNormals");
var Simplex_1 = require("../geometries/Simplex");
var SimplexMode_1 = require("../geometries/SimplexMode");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.TRIANGLE);
    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = a;
    // simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e1
    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = b;
    // simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e2
    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = c;
    // simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e3
    computeFaceNormals_1.computeFaceNormals(simplex, GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION, GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL);
    Simplex_1.Simplex.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
}
exports.triangle = triangle;
