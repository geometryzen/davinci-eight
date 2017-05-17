import { isNumber } from '../checks/isNumber';
import { isObject } from '../checks/isObject';
var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0 };
export function maskG3(arg) {
    if (isObject(arg) && 'maskG3' in arg) {
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
    else if (isNumber(arg)) {
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
