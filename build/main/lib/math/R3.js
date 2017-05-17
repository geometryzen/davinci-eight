"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeNumber_1 = require("../checks/mustBeNumber");
var wedgeXY_1 = require("./wedgeXY");
var wedgeYZ_1 = require("./wedgeYZ");
var wedgeZX_1 = require("./wedgeZX");
/**
 *
 */
function vectorCopy(vector) {
    return vec(vector.x, vector.y, vector.z);
}
exports.vectorCopy = vectorCopy;
function vectorFromCoords(x, y, z) {
    return vec(x, y, z);
}
exports.vectorFromCoords = vectorFromCoords;
function vec(x, y, z) {
    var dot = function dot(rhs) {
        return x * rhs.x + y * rhs.y + z * rhs.z;
    };
    var magnitude = function () {
        return Math.sqrt(x * x + y * y + z * z);
    };
    var projectionOnto = function projectionOnto(b) {
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var scp = x * bx + y * by + z * bz;
        var quad = bx * bx + by * by + bz * bz;
        var k = scp / quad;
        return vec(k * bx, k * by, k * bz);
    };
    var rejectionFrom = function rejectionFrom(b) {
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var scp = x * bx + y * by + z * bz;
        var quad = bx * bx + by * by + bz * bz;
        var k = scp / quad;
        return vec(x - k * bx, y - k * by, z - k * bz);
    };
    var rotate = function rotate(R) {
        var a = R.xy;
        var b = R.yz;
        var c = R.zx;
        var α = R.a;
        var ix = α * x - c * z + a * y;
        var iy = α * y - a * x + b * z;
        var iz = α * z - b * y + c * x;
        var iα = b * x + c * y + a * z;
        return vec(ix * α + iα * b + iy * a - iz * c, iy * α + iα * c + iz * b - ix * a, iz * α + iα * a + ix * c - iy * b);
    };
    var scale = function scale(α) {
        return vec(α * x, α * y, α * z);
    };
    var that = {
        get x() {
            return x;
        },
        get y() {
            return y;
        },
        get z() {
            return z;
        },
        add: function (rhs) {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        cross: function (rhs) {
            var yz = wedgeYZ_1.wedgeYZ(x, y, z, rhs.x, rhs.y, rhs.z);
            var zx = wedgeZX_1.wedgeZX(x, y, z, rhs.x, rhs.y, rhs.z);
            var xy = wedgeXY_1.wedgeXY(x, y, z, rhs.x, rhs.y, rhs.z);
            return vec(yz, zx, xy);
        },
        direction: function () {
            var magnitude = Math.sqrt(x * x + y * y + z * z);
            if (magnitude !== 0) {
                return vec(x / magnitude, y / magnitude, z / magnitude);
            }
            else {
                // direction is ambiguous (undefined) for the zero vector.
                return void 0;
            }
        },
        dot: dot,
        magnitude: magnitude,
        projectionOnto: projectionOnto,
        rejectionFrom: rejectionFrom,
        rotate: rotate,
        scale: scale,
        sub: function (rhs) {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __add__: function (rhs) {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        __radd__: function (lhs) {
            return vec(lhs.x + x, lhs.y + y, lhs.z + z);
        },
        __sub__: function (rhs) {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __rsub__: function (lhs) {
            return vec(lhs.x - x, lhs.y - y, lhs.z - z);
        },
        __mul__: function (rhs) {
            mustBeNumber_1.mustBeNumber('rhs', rhs);
            return vec(x * rhs, y * rhs, z * rhs);
        },
        __rmul__: function (lhs) {
            mustBeNumber_1.mustBeNumber('lhs', lhs);
            return vec(lhs * x, lhs * y, lhs * z);
        },
        __pos__: function () {
            return that;
        },
        __neg__: function () {
            return vec(-x, -y, -z);
        },
        toString: function () {
            return "[" + x + ", " + y + ", " + z + "]";
        }
    };
    return Object.freeze(that);
}
exports.vec = vec;
