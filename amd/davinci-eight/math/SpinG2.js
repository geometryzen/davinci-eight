var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorCartesianE2', '../math/dotVectorE2', '../checks/isDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE2', '../math/quadVectorE2', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY'], function (require, exports, dotVectorCartesianE2_1, dotVectorE2_1, isDefined_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadSpinorE2_1, quadVectorE2_1, rotorFromDirections_1, VectorN_1, wedgeXY_1) {
    var COORD_XY = 0;
    var COORD_ALPHA = 1;
    function one() {
        var coords = [0, 0];
        coords[COORD_ALPHA] = 1;
        coords[COORD_XY] = 0;
        return coords;
    }
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var SpinG2 = (function (_super) {
        __extends(SpinG2, _super);
        function SpinG2(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(SpinG2.prototype, "xy", {
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
        Object.defineProperty(SpinG2.prototype, "α", {
            get: function () {
                return this.coords[COORD_ALPHA];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_ALPHA] = α;
            },
            enumerable: true,
            configurable: true
        });
        SpinG2.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('spinor', spinor);
            mustBeNumber_1.default('α', α);
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        SpinG2.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.xy = a.xy + b.xy;
            return this;
        };
        SpinG2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        SpinG2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        SpinG2.prototype.adj = function () {
            throw new Error('TODO: SpinG2.adj');
        };
        SpinG2.prototype.angle = function () {
            return this.log().grade(2);
        };
        SpinG2.prototype.clone = function () {
            return SpinG2.copy(this);
        };
        SpinG2.prototype.conj = function () {
            this.xy = -this.xy;
            return this;
        };
        SpinG2.prototype.copy = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.xy = mustBeNumber_1.default('spinor.xy', spinor.xy);
            this.α = mustBeNumber_1.default('spinor.α', spinor.α);
            return this;
        };
        SpinG2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        SpinG2.prototype.copySpinor = function (spinor) {
            return this.copy(spinor);
        };
        SpinG2.prototype.copyVector = function (vector) {
            return this.zero();
        };
        SpinG2.prototype.cos = function () {
            throw new Error("SpinG2.cos");
        };
        SpinG2.prototype.cosh = function () {
            throw new Error("SpinG2.cosh");
        };
        SpinG2.prototype.div = function (s) {
            return this.div2(this, s);
        };
        SpinG2.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            var quadB = quadSpinorE2_1.default(b);
            this.α = (a0 * b0 + a1 * b1) / quadB;
            this.xy = (a1 * b0 - a0 * b1) / quadB;
            return this;
        };
        SpinG2.prototype.divByScalar = function (α) {
            this.xy /= α;
            this.α /= α;
            return this;
        };
        SpinG2.prototype.exp = function () {
            var w = this.α;
            var z = this.xy;
            var expW = exp(w);
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.xy = z * s;
            return this;
        };
        SpinG2.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNormSansUnits());
            return this;
        };
        SpinG2.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG2.prototype.lco2 = function (a, b) {
            return this;
        };
        SpinG2.prototype.lerp = function (target, α) {
            var R2 = SpinG2.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        SpinG2.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        SpinG2.prototype.log = function () {
            var w = this.α;
            var z = this.xy;
            var bb = z * z;
            var R2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.α = log(R);
            var f = atan2(R2, R0) / R2;
            this.xy = z * f;
            return this;
        };
        SpinG2.prototype.magnitude = function () {
            return this.norm();
        };
        SpinG2.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        SpinG2.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        SpinG2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            this.α = a0 * b0 - a1 * b1;
            this.xy = a0 * b1 + a1 * b0;
            return this;
        };
        SpinG2.prototype.neg = function () {
            this.α = -this.α;
            this.xy = -this.xy;
            return this;
        };
        SpinG2.prototype.norm = function () {
            var norm = this.magnitudeSansUnits();
            return this.zero().addScalar(norm);
        };
        SpinG2.prototype.direction = function () {
            var modulus = this.magnitudeSansUnits();
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        SpinG2.prototype.one = function () {
            this.α = 1;
            this.xy = 0;
            return this;
        };
        SpinG2.prototype.pow = function () {
            throw new Error("SpinG2.pow");
        };
        SpinG2.prototype.quad = function () {
            return this.squaredNorm();
        };
        SpinG2.prototype.sin = function () {
            throw new Error("SpinG2.sin");
        };
        SpinG2.prototype.sinh = function () {
            throw new Error("SpinG2.sinh");
        };
        SpinG2.prototype.squaredNorm = function () {
            var squaredNorm = this.squaredNormSansUnits();
            return this.zero().addScalar(squaredNorm);
        };
        SpinG2.prototype.squaredNormSansUnits = function () {
            return quadSpinorE2_1.default(this);
        };
        SpinG2.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG2.prototype.rco2 = function (a, b) {
            return this;
        };
        SpinG2.prototype.rev = function () {
            this.xy *= -1;
            return this;
        };
        SpinG2.prototype.reflect = function (n) {
            var w = this.α;
            var β = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nn = nx * nx + ny * ny;
            this.α = nn * w;
            this.xy = -nn * β;
            return this;
        };
        SpinG2.prototype.rotate = function (rotor) {
            console.warn("SpinG2.rotate is not implemented");
            return this;
        };
        SpinG2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
                return this;
            }
            else {
            }
        };
        SpinG2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG2.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG2.prototype.scp2 = function (a, b) {
            return this;
        };
        SpinG2.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG2.prototype.slerp = function (target, α) {
            var R2 = SpinG2.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        SpinG2.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('s', s);
            mustBeNumber_1.default('α', α);
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        SpinG2.prototype.sub2 = function (a, b) {
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        SpinG2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorCartesianE2_1.default(ax, ay, bx, by);
            this.xy = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
            return this;
        };
        SpinG2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
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
                    this.xy = 0;
                }
            }
            return this;
        };
        SpinG2.prototype.toExponential = function () {
            return this.toString();
        };
        SpinG2.prototype.toFixed = function (digits) {
            return this.toString();
        };
        SpinG2.prototype.toString = function () {
            return "SpinG2({β: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG2.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG2.prototype.ext2 = function (a, b) {
            return this;
        };
        SpinG2.prototype.zero = function () {
            this.α = 0;
            this.xy = 0;
            return this;
        };
        SpinG2.copy = function (spinor) {
            return new SpinG2().copy(spinor);
        };
        SpinG2.lerp = function (a, b, α) {
            return SpinG2.copy(a).lerp(b, α);
        };
        SpinG2.rotorFromDirections = function (a, b) {
            return new SpinG2().rotorFromDirections(a, b);
        };
        return SpinG2;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SpinG2;
});
