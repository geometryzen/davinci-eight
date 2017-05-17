"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeDefined_1 = require("../checks/mustBeDefined");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Spinor3_1 = require("../math/Spinor3");
var Vector3_1 = require("../math/Vector3");
/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * begin {VectorE3} The begin position.
 * angle: {number} The angle of the rotation.
 * generator {SpinorE3} The generator of the rotation.
 * segments {number} The number of segments.
 */
function arc3(begin, angle, generator, segments) {
    mustBeDefined_1.mustBeDefined('begin', begin);
    mustBeNumber_1.mustBeNumber('angle', angle);
    mustBeDefined_1.mustBeDefined('generator', generator);
    mustBeInteger_1.mustBeInteger('segments', segments);
    /**
     * The return value is an array of points with length => segments + 1.
     */
    var points = [];
    /**
     * Temporary point that we will advance for each segment.
     */
    var point = Vector3_1.Vector3.copy(begin);
    /**
     * The rotor that advances us through one segment.
     */
    var rotor = Spinor3_1.Spinor3.copy(generator).scale((-angle / 2) / segments).exp();
    points.push(point.clone());
    for (var i = 0; i < segments; i++) {
        point.rotate(rotor);
        points.push(point.clone());
    }
    return points;
}
exports.arc3 = arc3;
