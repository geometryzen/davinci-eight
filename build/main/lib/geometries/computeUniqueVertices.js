"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This function has the important side-effect of setting the vertex index property.
function computeUniqueVertices(geometry) {
    var map = {};
    var vertices = [];
    function munge(vertex) {
        var key = vertex.toString();
        if (map[key]) {
            var existing = map[key];
            vertex.index = existing.index;
        }
        else {
            vertex.index = vertices.length;
            vertices.push(vertex);
            map[key] = vertex;
        }
    }
    geometry.forEach(function (simplex) {
        simplex.vertices.forEach(function (vertex) {
            munge(vertex);
        });
    });
    return vertices;
}
exports.computeUniqueVertices = computeUniqueVertices;
