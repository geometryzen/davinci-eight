"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0 };
function maskG3(arg) {
    if (isObject_1.isObject(arg) && 'maskG3' in arg) {
        var duck = arg;
        var g = arg;
        if (duck.maskG3 & 0x1) {
            scratch.a = g.a;
        }
        else {
            scratch.a = 0;
        }
        if (duck.maskG3 & 0x2) {
            scratch.x = g.x;
            scratch.y = g.y;
            scratch.z = g.z;
        }
        else {
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
        }
        if (duck.maskG3 & 0x4) {
            scratch.yz = g.yz;
            scratch.zx = g.zx;
            scratch.xy = g.xy;
        }
        else {
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
        }
        if (duck.maskG3 & 0x8) {
            scratch.b = g.b;
        }
        else {
            scratch.b = 0;
        }
        return scratch;
    }
    else if (isNumber_1.isNumber(arg)) {
        scratch.a = arg;
        scratch.x = 0;
        scratch.y = 0;
        scratch.z = 0;
        scratch.yz = 0;
        scratch.zx = 0;
        scratch.xy = 0;
        scratch.b = 0;
        return scratch;
    }
    else {
        return void 0;
    }
}
exports.maskG3 = maskG3;
