"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var isNumber_1 = require("../checks/isNumber");
function quadSpinorE3(s) {
    if (isDefined_1.isDefined(s)) {
        var α = s.a;
        var x = s.yz;
        var y = s.zx;
        var z = s.xy;
        if (isNumber_1.isNumber(α) && isNumber_1.isNumber(x) && isNumber_1.isNumber(y) && isNumber_1.isNumber(z)) {
            return α * α + x * x + y * y + z * z;
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
exports.quadSpinorE3 = quadSpinorE3;
