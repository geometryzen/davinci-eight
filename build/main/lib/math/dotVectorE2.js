"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
function dotVectorE2(a, b) {
    if (isDefined_1.isDefined(a) && isDefined_1.isDefined(b)) {
        return a.x * b.x + a.y * b.y;
    }
    else {
        return void 0;
    }
}
exports.dotVectorE2 = dotVectorE2;
