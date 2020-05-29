"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewMatrixFromEyeLookUp = void 0;
var isDefined_1 = require("../checks/isDefined");
var Matrix4_1 = require("../math/Matrix4");
var viewArrayFromEyeLookUp_1 = require("./viewArrayFromEyeLookUp");
function viewMatrixFromEyeLookUp(eye, look, up, matrix) {
    var m = isDefined_1.isDefined(matrix) ? matrix : Matrix4_1.Matrix4.one.clone();
    viewArrayFromEyeLookUp_1.viewArrayFromEyeLookUp(eye, look, up, m.elements);
    return m;
}
exports.viewMatrixFromEyeLookUp = viewMatrixFromEyeLookUp;
