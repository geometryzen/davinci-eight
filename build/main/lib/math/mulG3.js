"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compG3Get_1 = require("../math/compG3Get");
var mulE3_1 = require("../math/mulE3");
function mulG3(a, b, out) {
    var a0 = a.a;
    var a1 = a.x;
    var a2 = a.y;
    var a3 = a.z;
    var a4 = a.xy;
    var a5 = a.yz;
    var a6 = a.zx;
    var a7 = a.b;
    var b0 = compG3Get_1.compG3Get(b, 0);
    var b1 = compG3Get_1.compG3Get(b, 1);
    var b2 = compG3Get_1.compG3Get(b, 2);
    var b3 = compG3Get_1.compG3Get(b, 3);
    var b4 = compG3Get_1.compG3Get(b, 4);
    var b5 = compG3Get_1.compG3Get(b, 5);
    var b6 = compG3Get_1.compG3Get(b, 6);
    var b7 = compG3Get_1.compG3Get(b, 7);
    var iLen = out.length;
    for (var i = 0; i < iLen; i++) {
        out[i] = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
    }
}
exports.mulG3 = mulG3;
