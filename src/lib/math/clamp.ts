import { mustBeNumber } from '../checks/mustBeNumber';

/**
 * @hidden
 */
export function clamp(x: number, min: number, max: number): number {
    mustBeNumber('x', x);
    mustBeNumber('min', min);
    mustBeNumber('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
}
