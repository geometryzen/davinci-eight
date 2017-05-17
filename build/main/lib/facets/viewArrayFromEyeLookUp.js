"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector3_1 = require("../math/Vector3");
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isDefined_1 = require("../checks/isDefined");
// Assume single-threaded to avoid temporary object creation.
var n = new Vector3_1.Vector3();
var u = new Vector3_1.Vector3();
var v = new Vector3_1.Vector3();
function viewArrayFromEyeLookUp(eye, look, up, matrix) {
    var m = isDefined_1.isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    mustSatisfy_1.mustSatisfy('matrix', m.length === 16, function () { return 'matrix must have length 16'; });
    n.copy(eye).sub(look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
        // view direction is ambiguous.
        n.z = 1;
    }
    else {
        n.normalize();
    }
    n.approx(12).normalize();
    u.copy(up).cross(n).approx(12).normalize();
    v.copy(n).cross(u).approx(12).normalize();
    m[0x0] = u.x;
    m[0x4] = u.y;
    m[0x8] = u.z;
    m[0xC] = -Vector3_1.Vector3.dot(eye, u);
    m[0x1] = v.x;
    m[0x5] = v.y;
    m[0x9] = v.z;
    m[0xD] = -Vector3_1.Vector3.dot(eye, v);
    m[0x2] = n.x;
    m[0x6] = n.y;
    m[0xA] = n.z;
    m[0xE] = -Vector3_1.Vector3.dot(eye, n);
    m[0x3] = 0.0;
    m[0x7] = 0.0;
    m[0xB] = 0.0;
    m[0xF] = 1;
    return m;
}
exports.viewArrayFromEyeLookUp = viewArrayFromEyeLookUp;
