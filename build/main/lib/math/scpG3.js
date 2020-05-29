"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scpG3 = void 0;
var compG3Get_1 = require("../math/compG3Get");
var mulE3_1 = require("../math/mulE3");
var compG3Set_1 = require("../math/compG3Set");
function scpG3(a, b, out) {
    var a0 = compG3Get_1.compG3Get(a, 0);
    var a1 = compG3Get_1.compG3Get(a, 1);
    var a2 = compG3Get_1.compG3Get(a, 2);
    var a3 = compG3Get_1.compG3Get(a, 3);
    var a4 = compG3Get_1.compG3Get(a, 4);
    var a5 = compG3Get_1.compG3Get(a, 5);
    var a6 = compG3Get_1.compG3Get(a, 6);
    var a7 = compG3Get_1.compG3Get(a, 7);
    var b0 = compG3Get_1.compG3Get(b, 0);
    var b1 = compG3Get_1.compG3Get(b, 1);
    var b2 = compG3Get_1.compG3Get(b, 2);
    var b3 = compG3Get_1.compG3Get(b, 3);
    var b4 = compG3Get_1.compG3Get(b, 4);
    var b5 = compG3Get_1.compG3Get(b, 5);
    var b6 = compG3Get_1.compG3Get(b, 6);
    var b7 = compG3Get_1.compG3Get(b, 7);
    compG3Set_1.compG3Set(out, 0, mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
    compG3Set_1.compG3Set(out, 1, 0);
    compG3Set_1.compG3Set(out, 2, 0);
    compG3Set_1.compG3Set(out, 3, 0);
    compG3Set_1.compG3Set(out, 4, 0);
    compG3Set_1.compG3Set(out, 5, 0);
    compG3Set_1.compG3Set(out, 6, 0);
    compG3Set_1.compG3Set(out, 7, 0);
    return out;
}
exports.scpG3 = scpG3;
