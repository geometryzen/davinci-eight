"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotVectorCartesianE2_1 = require("../math/dotVectorCartesianE2");
var isDefined_1 = require("../checks/isDefined");
var isNumber_1 = require("../checks/isNumber");
function quadVectorE2(vector) {
    if (isDefined_1.isDefined(vector)) {
        var x = vector.x;
        var y = vector.y;
        if (isNumber_1.isNumber(x) && isNumber_1.isNumber(y)) {
            return dotVectorCartesianE2_1.dotVectorCartesianE2(x, y, x, y);
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
exports.quadVectorE2 = quadVectorE2;
