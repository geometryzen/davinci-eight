import { R3 } from '../math/R3';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';

const INITIAL_AXIS = canonicalAxis;
const INITIAL_LENGTH = 1.0;
const INITIAL_MERIDIAN = canonicalMeridian;
const INITIAL_RADIUS = 0.5;
const INITIAL_SLICE = 2 * Math.PI;

export interface ALR {
    axis: Readonly<R3>;
    length: number;
    meridian: Readonly<R3>;
    radius: number;
    sliceAngle: number;
}

function make(axis: Readonly<R3>, length: number, meridian: Readonly<R3>, radius: number, sliceAngle: number): ALR {
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

export const ds = make(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);
