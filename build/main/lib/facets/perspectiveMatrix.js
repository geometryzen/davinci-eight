"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perspectiveMatrix = void 0;
var isDefined_1 = require("../checks/isDefined");
var Matrix4_1 = require("../math/Matrix4");
var perspectiveArray_1 = require("./perspectiveArray");
function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined_1.isDefined(matrix) ? matrix : Matrix4_1.Matrix4.one.clone();
    perspectiveArray_1.perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}
exports.perspectiveMatrix = perspectiveMatrix;
