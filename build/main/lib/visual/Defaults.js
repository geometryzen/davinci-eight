"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ds = void 0;
var tiltFromOptions_1 = require("../core/tiltFromOptions");
var INITIAL_AXIS = tiltFromOptions_1.canonicalAxis;
var INITIAL_LENGTH = 1.0;
var INITIAL_MERIDIAN = tiltFromOptions_1.canonicalMeridian;
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
exports.ds = make(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);
