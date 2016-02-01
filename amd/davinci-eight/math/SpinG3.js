var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorCartesianE3', '../math/dotVectorE3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE3', '../math/quadVectorE3', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorCartesianE3_1, dotVectorE3_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadSpinorE3_1, quadVectorE3_1, rotorFromDirections_1, VectorN_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var COORD_YZ = 0;
    var COORD_ZX = 1;
    var COORD_XY = 2;
    var COORD_SCALAR = 3;
    function one() {
        var coords = [0, 0, 0, 0];
        coords[COORD_SCALAR] = 1;
        return coords;
    }
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var SpinG3 = (function (_super) {
        __extends(SpinG3, _super);
        function SpinG3(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 4);
        }
        Object.defineProperty(SpinG3.prototype, "yz", {
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber_1.default('yz', yz);
                this.modified = this.modified || this.yz !== yz;
                this.coords[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "zx", {
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber_1.default('zx', zx);
                this.modified = this.modified || this.zx !== zx;
                this.coords[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "xy", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber_1.default('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "α", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        SpinG3.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('spinor', spinor);
            mustBeNumber_1.default('α', α);
            this.yz += spinor.yz * α;
            this.zx += spinor.zx * α;
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        SpinG3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        SpinG3.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        SpinG3.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        SpinG3.prototype.adj = function () {
            throw new Error('TODO: SpinG3.adj');
        };
        SpinG3.prototype.angle = function () {
            return this.log().grade(2);
        };
        SpinG3.prototype.clone = function () {
            return SpinG3.copy(this);
        };
        SpinG3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        SpinG3.prototype.copy = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.yz = mustBeNumber_1.default('spinor.yz', spinor.yz);
            this.zx = mustBeNumber_1.default('spinor.zx', spinor.zx);
            this.xy = mustBeNumber_1.default('spinor.xy', spinor.xy);
            this.α = mustBeNumber_1.default('spinor.α', spinor.α);
            return this;
        };
        SpinG3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        SpinG3.prototype.copySpinor = function (s) {
            return this.copy(s);
        };
        SpinG3.prototype.copyVector = function (vector) {
            return this.zero();
        };
        SpinG3.prototype.div = function (s) {
            return this.div2(this, s);
        };
        SpinG3.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        SpinG3.prototype.divByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.α /= α;
            return this;
        };
        SpinG3.prototype.dual = function (v) {
            mustBeObject_1.default('v', v);
            this.α = 0;
            this.yz = mustBeNumber_1.default('v.x', v.x);
            this.zx = mustBeNumber_1.default('v.y', v.y);
            this.xy = mustBeNumber_1.default('v.z', v.z);
            return this;
        };
        SpinG3.prototype.exp = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            var φ = sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.yz = x * s;
            this.zx = y * s;
            this.xy = z * s;
            return this;
        };
        SpinG3.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNormSansUnits());
            return this;
        };
        SpinG3.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG3.prototype.lco2 = function (a, b) {
            return this;
        };
        SpinG3.prototype.lerp = function (target, α) {
            var R2 = SpinG3.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        SpinG3.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        SpinG3.prototype.log = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var bb = x * x + y * y + z * z;
            var R2 = sqrt(bb);
            var R0 = Math.abs(w);
            var R = sqrt(w * w + bb);
            this.α = Math.log(R);
            var θ = Math.atan2(R2, R0) / R2;
            this.yz = x * θ;
            this.zx = y * θ;
            this.xy = z * θ;
            return this;
        };
        SpinG3.prototype.magnitude = function () {
            return this.norm();
        };
        SpinG3.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        SpinG3.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        SpinG3.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        SpinG3.prototype.neg = function () {
            this.α = -this.α;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        SpinG3.prototype.norm = function () {
            var norm = this.magnitudeSansUnits();
            return this.zero().addScalar(norm);
        };
        SpinG3.prototype.direction = function () {
            var modulus = this.magnitudeSansUnits();
            this.yz = this.yz / modulus;
            this.zx = this.zx / modulus;
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        SpinG3.prototype.one = function () {
            this.α = 1;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        SpinG3.prototype.quad = function () {
            return this.squaredNorm();
        };
        SpinG3.prototype.squaredNorm = function () {
            var squaredNorm = this.squaredNormSansUnits();
            return this.zero().addScalar(squaredNorm);
        };
        SpinG3.prototype.squaredNormSansUnits = function () {
            return quadSpinorE3_1.default(this);
        };
        SpinG3.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG3.prototype.rco2 = function (a, b) {
            return this;
        };
        SpinG3.prototype.rev = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        SpinG3.prototype.reflect = function (n) {
            var w = this.α;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var nn = nx * nx + ny * ny + nz * nz;
            var nB = nx * yz + ny * zx + nz * xy;
            this.α = nn * w;
            this.xy = 2 * nz * nB - nn * xy;
            this.yz = 2 * nx * nB - nn * yz;
            this.zx = 2 * ny * nB - nn * zx;
            return this;
        };
        SpinG3.prototype.rotate = function (rotor) {
            console.warn("SpinG3.rotate is not implemented");
            return this;
        };
        SpinG3.prototype.rotorFromDirections = function (a, b) {
            return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        SpinG3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.α = cos(φ);
            return this;
        };
        SpinG3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG3.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG3.prototype.scp2 = function (a, b) {
            return this;
        };
        SpinG3.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG3.prototype.slerp = function (target, α) {
            var R2 = SpinG3.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        SpinG3.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('s', s);
            mustBeNumber_1.default('α', α);
            this.yz -= s.yz * α;
            this.zx -= s.zx * α;
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        SpinG3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        SpinG3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.α = dotVectorCartesianE3_1.default(ax, ay, az, bx, by, bz);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        SpinG3.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
            }
            return this;
        };
        SpinG3.prototype.toExponential = function () {
            return this.toString();
        };
        SpinG3.prototype.toFixed = function (digits) {
            return this.toString();
        };
        SpinG3.prototype.toString = function () {
            return "SpinG3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG3.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG3.prototype.ext2 = function (a, b) {
            return this;
        };
        SpinG3.prototype.zero = function () {
            this.α = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        SpinG3.copy = function (spinor) {
            return new SpinG3().copy(spinor);
        };
        SpinG3.dual = function (v) {
            return new SpinG3().dual(v);
        };
        SpinG3.lerp = function (a, b, α) {
            return SpinG3.copy(a).lerp(b, α);
        };
        SpinG3.rotorFromDirections = function (a, b) {
            return new SpinG3().rotorFromDirections(a, b);
        };
        return SpinG3;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SpinG3;
});
