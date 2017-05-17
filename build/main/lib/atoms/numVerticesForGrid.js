"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeInteger_1 = require("../checks/mustBeInteger");
/**
 * Computes the number of vertices required to construct a grid.
 */
function numVerticesForGrid(uSegments, vSegments) {
    mustBeInteger_1.mustBeInteger('uSegments', uSegments);
    mustBeInteger_1.mustBeInteger('vSegments', vSegments);
    return (uSegments + 1) * (vSegments + 1);
}
exports.numVerticesForGrid = numVerticesForGrid;
