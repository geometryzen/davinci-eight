var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorE3', '../math/Euclidean3', '../math/Mat3R', '../math/Mat4R', '../checks/isDefined', '../checks/isNumber', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/toStringCustom', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorE3_1, Euclidean3_1, Mat3R_1, Mat4R_1, isDefined_1, isNumber_1, mustBeNumber_1, mustBeObject_1, toStringCustom_1, VectorN_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    var COORD_Z = 2;
    var BASIS_LABELS = ['e1', 'e2', 'e3'];
    function coordinates(m) {
        return [m.x, m.y, m.z];
    }
    var R3 = (function (_super) {
        __extends(R3, _super);
        function R3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        R3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(R3.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[COORD_X] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R3.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[COORD_Y] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R3.prototype, "z", {
            get: function () {
                return this.coords[COORD_Z];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.coords[COORD_Z] = value;
            },
            enumerable: true,
            configurable: true
        });
        R3.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('vector', vector);
            mustBeNumber_1.default('α', α);
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            return this;
        };
        R3.prototype.add2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        R3.prototype.applyMatrix = function (m) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
            this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
            this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
            return this;
        };
        R3.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
            this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
            this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
            return this;
        };
        R3.prototype.reflect = function (n) {
            mustBeObject_1.default('n', n);
            var ax = this.x;
            var ay = this.y;
            var az = this.z;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var dot2 = (ax * nx + ay * ny + az * nz) * 2;
            this.x = ax - dot2 * nx;
            this.y = ay - dot2 * ny;
            this.z = az - dot2 * nz;
            return this;
        };
        R3.prototype.rotate = function (R) {
            mustBeObject_1.default('R', R);
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.α;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
            return this;
        };
        R3.prototype.clone = function () {
            return new R3([this.x, this.y, this.z]);
        };
        R3.prototype.copy = function (v) {
            mustBeObject_1.default('v', v);
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        R3.prototype.copyCoordinates = function (coordinates) {
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            return this;
        };
        R3.prototype.cross = function (v) {
            mustBeObject_1.default('v', v);
            return this.cross2(this, v);
        };
        R3.prototype.cross2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        R3.prototype.distanceTo = function (point) {
            if (isDefined_1.default(point)) {
                return sqrt(this.quadranceTo(point));
            }
            else {
                return void 0;
            }
        };
        R3.prototype.quadranceTo = function (point) {
            if (isDefined_1.default(point)) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                var dz = this.z - point.z;
                return dx * dx + dy * dy + dz * dz;
            }
            else {
                return void 0;
            }
        };
        R3.prototype.divByScalar = function (α) {
            mustBeNumber_1.default('α', α);
            if (α !== 0) {
                var invScalar = 1 / α;
                this.x *= invScalar;
                this.y *= invScalar;
                this.z *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        };
        R3.prototype.dot = function (v) {
            return R3.dot(this, v);
        };
        R3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        R3.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        R3.prototype.lerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            return this;
        };
        R3.prototype.lerp2 = function (a, b, α) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            mustBeNumber_1.default('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        R3.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        R3.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.x *= α;
            this.y *= α;
            this.z *= α;
            return this;
        };
        R3.prototype.setXYZ = function (x, y, z) {
            this.x = mustBeNumber_1.default('x', x);
            this.y = mustBeNumber_1.default('y', y);
            this.z = mustBeNumber_1.default('z', z);
            return this;
        };
        R3.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        R3.prototype.slerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            return this;
        };
        R3.prototype.squaredNorm = function () {
            return dotVectorE3_1.default(this, this);
        };
        R3.prototype.sub = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('v', v);
            mustBeNumber_1.default('α', α);
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        };
        R3.prototype.sub2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        R3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        R3.prototype.__add__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().add(rhs, 1.0);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__mul__ = function (rhs) {
            if (isNumber_1.default(rhs)) {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__rmul__ = function (lhs) {
            if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else if (lhs instanceof Mat3R_1.default) {
                var m33 = lhs;
                return this.clone().applyMatrix(m33);
            }
            else if (lhs instanceof Mat4R_1.default) {
                var m44 = lhs;
                return this.clone().applyMatrix4(m44);
            }
            else {
                return void 0;
            }
        };
        R3.copy = function (vector) {
            return new R3([vector.x, vector.y, vector.z]);
        };
        R3.lerp = function (a, b, α) {
            return R3.copy(b).sub(a).scale(α).add(a);
        };
        R3.random = function () {
            return new R3([Math.random(), Math.random(), Math.random()]);
        };
        R3.e1 = Euclidean3_1.default.e1;
        R3.e2 = Euclidean3_1.default.e2;
        R3.e3 = Euclidean3_1.default.e3;
        return R3;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = R3;
});
