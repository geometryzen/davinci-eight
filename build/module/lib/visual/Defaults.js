import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
var INITIAL_AXIS = canonicalAxis;
var INITIAL_LENGTH = 1.0;
var INITIAL_MERIDIAN = canonicalMeridian;
var INITIAL_RADIUS = 0.5;
var INITIAL_SLICE = 2 * Math.PI;
function make(axis, length, meridian, radius, sliceAngle) {
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
    return { axis: axis, length: length, meridian: meridian, radius: radius, sliceAngle: sliceAngle };
}
export var ds = make(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);
