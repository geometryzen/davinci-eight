import { mustBeNumber } from '../checks/mustBeNumber';
export function clamp(x, min, max) {
    mustBeNumber('x', x);
    mustBeNumber('min', min);
    mustBeNumber('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
}
