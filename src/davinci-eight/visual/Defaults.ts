import { R3 } from '../math/R3';
import vec from '../math/R3';

const INITIAL_AXIS = vec(1, 0, 0);
const INITIAL_LENGTH = 1.0;
const INITIAL_MERIDIAN = vec(0, 1, 0);
const INITIAL_RADIUS = 0.5;
const INITIAL_SLICE = 2 * Math.PI;

export interface ALR {
    axis: R3;
    length: number;
    meridian: R3;
    radius: number;
    sliceAngle: number;
}

function makeALR(axis: R3, length: number, meridian: R3, radius: number, sliceAngle: number): ALR {
    /*
    const that: ALR = {
        get axis(): R3 {
            return axis;
        },
        get length(): number {
            return length;
        },
        get radius(): number {
            return radius;
        }
    };
    return Object.freeze(that);
    */
    return { axis, length, meridian, radius, sliceAngle };
}

export const ds = makeALR(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);
