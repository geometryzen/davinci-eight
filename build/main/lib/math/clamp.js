"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeNumber_1 = require("../checks/mustBeNumber");
function clamp(x, min, max) {
    mustBeNumber_1.mustBeNumber('x', x);
    mustBeNumber_1.mustBeNumber('min', min);
    mustBeNumber_1.mustBeNumber('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
}
exports.clamp = clamp;
