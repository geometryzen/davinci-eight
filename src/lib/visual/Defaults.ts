import { R3 } from '../math/R3';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';

const INITIAL_AXIS = canonicalAxis;
const INITIAL_LENGTH = 1.0;
const INITIAL_MERIDIAN = canonicalMeridian;
const INITIAL_RADIUS = 0.5;
const INITIAL_SLICE = 2 * Math.PI;

export interface ALMRS {
    /**
     * Default e2
     */
    axis: Readonly<R3>;
    /**
     * Default 1
     */
    length: number;
    /**
     * Default e3
     */
    meridian: Readonly<R3>;
    /**
     * Default 0.5
     */
    radius: number;
    /**
     * Default tau
     */
    sliceAngle: number;
}

function make(axis: Readonly<R3>, length: number, meridian: Readonly<R3>, radius: number, sliceAngle: number): ALMRS {
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

/**
 * Defaults:
 * axis:       e2,
 * length:     1,
 * meridian:   e3,
 * radius:     0.5,
 * sliceAngle: tau.
 */
export const ds: ALMRS = make(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);
