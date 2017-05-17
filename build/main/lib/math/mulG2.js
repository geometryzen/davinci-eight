"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compG2Get_1 = require("../math/compG2Get");
var mulE2_1 = require("../math/mulE2");
var compG2Set_1 = require("../math/compG2Set");
function mulG2(a, b, out) {
    var a0 = compG2Get_1.compG2Get(a, 0);
    var a1 = compG2Get_1.compG2Get(a, 1);
    var a2 = compG2Get_1.compG2Get(a, 2);
    var a3 = compG2Get_1.compG2Get(a, 3);
    var b0 = compG2Get_1.compG2Get(b, 0);
    var b1 = compG2Get_1.compG2Get(b, 1);
    var b2 = compG2Get_1.compG2Get(b, 2);
    var b3 = compG2Get_1.compG2Get(b, 3);
    for (var i = 0; i < 4; i++) {
        compG2Set_1.compG2Set(out, i, mulE2_1.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, i));
    }
    return out;
}
exports.mulG2 = mulG2;
