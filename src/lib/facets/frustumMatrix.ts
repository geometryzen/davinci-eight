import { mustBeNumber } from '../checks/mustBeNumber';
import { isDefined } from '../checks/isDefined';

export function frustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array): Float32Array {

    mustBeNumber('left', left);
    mustBeNumber('right', right);
    mustBeNumber('bottom', bottom);
    mustBeNumber('top', top);
    mustBeNumber('near', near);
    mustBeNumber('far', far);

    const m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const x = 2 * near / (right - left);
    const y = 2 * near / (top - bottom);

    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    const c = - (far + near) / (far - near);
    const d = - 2 * far * near / (far - near);

    m[0x0] = x; m[0x4] = 0; m[0x8] = a; m[0xC] = 0;
    m[0x1] = 0; m[0x5] = y; m[0x9] = b; m[0xD] = 0;
    m[0x2] = 0; m[0x6] = 0; m[0xA] = c; m[0xE] = d;
    m[0x3] = 0; m[0x7] = 0; m[0xB] = -1; m[0xF] = 0;

    return m;
}