"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var isNumber_1 = require("../checks/isNumber");
function quadSpinorE2(s) {
    if (isDefined_1.isDefined(s)) {
        var α = s.a;
        var β = s.b;
        if (isNumber_1.isNumber(α) && isNumber_1.isNumber(β)) {
            return α * α + β * β;
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
exports.quadSpinorE2 = quadSpinorE2;
