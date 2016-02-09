var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/b2', '../geometries/b3', '../math/dotVectorE2', '../math/Euclidean2', '../math/extE2', '../checks/isDefined', '../checks/isNumber', '../checks/isObject', '../math/lcoE2', '../math/mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadVectorE2', '../math/rcoE2', '../math/rotorFromDirections', '../math/scpE2', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY'], function (require, exports, b2_1, b3_1, dotVectorE2_1, Euclidean2_1, extE2_1, isDefined_1, isNumber_1, isObject_1, lcoE2_1, mulE2_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadVectorE2_1, rcoE2_1, rotorFromDirections_1, scpE2_1, stringFromCoordinates_1, VectorN_1, wedgeXY_1) {
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_XY = 3;
    var PI = Math.PI;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var STANDARD_LABELS = ["1", "e1", "e2", "I"];
    function coordinates(m) {
        return [m.α, m.x, m.y, m.β];
    }
    function duckCopy(value) {
        if (isObject_1.default(value)) {
            var m = value;
            if (isNumber_1.default(m.x) && isNumber_1.default(m.y)) {
                if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
                    console.warn("Copying GeometricE2 to G2");
                    return G2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to G2");
                    return G2.fromVector(m);
                }
            }
            else {
                if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
                    console.warn("Copying SpinorE2 to G2");
                    return G2.fromSpinor(m);
                }
                else {
                    return void 0;
                }
            }
        }
        else {
            return void 0;
        }
    }
    var G2 = (function (_super) {
        __extends(G2, _super);
        function G2() {
            _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(G2.prototype, "α", {
            get: function () {
                return this.coords[COORD_W];
            },
            set: function (α) {
                this.modified = this.modified || this.coords[COORD_W] !== α;
                this.coords[COORD_W] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (x) {
                this.modified = this.modified || this.coords[COORD_X] !== x;
                this.coords[COORD_X] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (y) {
                this.modified = this.modified || this.coords[COORD_Y] !== y;
                this.coords[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (β) {
                this.modified = this.modified || this.coords[COORD_XY] !== β;
                this.coords[COORD_XY] = β;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "xy", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                this.modified = this.modified || this.coords[COORD_XY] !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        G2.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('M', M);
            mustBeNumber_1.default('α', α);
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.β += M.β * α;
            return this;
        };
        G2.prototype.add2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.β = a.β + b.β;
            return this;
        };
        G2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            this.β += β;
            return this;
        };
        G2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        G2.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('v', v);
            mustBeNumber_1.default('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        };
        G2.prototype.adj = function () {
            throw new Error('TODO: G2.adj');
        };
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        G2.prototype.clone = function () {
            var m = new G2();
            m.copy(this);
            return m;
        };
        G2.prototype.conj = function () {
            this.β = -this.β;
            return this;
        };
        G2.prototype.cos = function () {
            throw new Error("TODO: G2.cos");
        };
        G2.prototype.cosh = function () {
            throw new Error("TODO: G2.cosh");
        };
        G2.prototype.distanceTo = function (point) {
            throw new Error("TODO: G2.distanceTo");
        };
        G2.prototype.equals = function (point) {
            throw new Error("TODO: G2.equals");
        };
        G2.prototype.copy = function (M) {
            mustBeObject_1.default('M', M);
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.β = M.β;
            return this;
        };
        G2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        G2.prototype.copySpinor = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.α = spinor.α;
            this.x = 0;
            this.y = 0;
            this.β = spinor.xy;
            return this;
        };
        G2.prototype.copyVector = function (vector) {
            mustBeObject_1.default('vector', vector);
            this.α = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.β = 0;
            return this;
        };
        G2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        G2.prototype.direction = function () {
            var norm = sqrt(this.squaredNormSansUnits());
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.β = this.β / norm;
            return this;
        };
        G2.prototype.div = function (m) {
            return this.div2(this, m);
        };
        G2.prototype.div2 = function (a, b) {
            return this;
        };
        G2.prototype.divByScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.β /= α;
            return this;
        };
        G2.prototype.dual = function (m) {
            var w = -m.β;
            var x = +m.y;
            var y = -m.x;
            var β = +m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        G2.prototype.exp = function () {
            var w = this.α;
            var z = this.β;
            var expW = exp(w);
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.β = z * s;
            return this;
        };
        G2.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        G2.prototype.ext2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        G2.prototype.inv = function () {
            this.conj();
            return this;
        };
        G2.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        G2.prototype.lco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        G2.prototype.lerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        G2.prototype.lerp2 = function (a, b, α) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            mustBeNumber_1.default('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        G2.prototype.log = function () {
            var α = this.α;
            var β = this.β;
            this.α = log(sqrt(α * α + β * β));
            this.x = 0;
            this.y = 0;
            this.β = atan2(β, α);
            return this;
        };
        G2.prototype.magnitude = function () {
            return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        G2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        G2.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.β = -this.β;
            return this;
        };
        G2.prototype.norm = function () {
            this.α = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.one = function () {
            this.α = 1;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.pow = function () {
            throw new Error("TODO: G2.pow");
        };
        G2.prototype.quad = function () {
            this.α = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        G2.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        G2.prototype.rco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        G2.prototype.reflect = function (n) {
            mustBeObject_1.default('n', n);
            var N = Euclidean2_1.default.fromVectorE2(n);
            var M = Euclidean2_1.default.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        G2.prototype.rev = function () {
            this.α = this.α;
            this.x = this.x;
            this.y = this.y;
            this.β = -this.β;
            return this;
        };
        G2.prototype.sin = function () {
            throw new Error("G2.sin");
        };
        G2.prototype.sinh = function () {
            throw new Error("G2.sinh");
        };
        G2.prototype.rotate = function (R) {
            mustBeObject_1.default('R', R);
            var x = this.x;
            var y = this.y;
            var a = R.xy;
            var α = R.α;
            var ix = α * x + a * y;
            var iy = α * y - a * x;
            this.x = ix * α + iy * a;
            this.y = iy * α - ix * a;
            return this;
        };
        G2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
                return this;
            }
            else {
                this.rotorFromGeneratorAngle(G2.I, PI);
            }
            return this;
        };
        G2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeObject_1.default('B', B);
            mustBeNumber_1.default('θ', θ);
            var β = B.xy;
            var φ = θ / 2;
            this.α = cos(abs(β) * φ);
            this.x = 0;
            this.y = 0;
            this.β = -sin(β * φ);
            return this;
        };
        G2.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        G2.prototype.scp2 = function (a, b) {
            this.α = scpE2_1.default(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.β *= α;
            return this;
        };
        G2.prototype.slerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            return this;
        };
        G2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorE2_1.default(a, b);
            this.x = 0;
            this.y = 0;
            this.β = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
            return this;
        };
        G2.prototype.squaredNorm = function () {
            this.α = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.squaredNormSansUnits = function () {
            var w = this.α;
            var x = this.x;
            var y = this.y;
            var B = this.β;
            return w * w + x * x + y * y + B * B;
        };
        G2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('M', M);
            mustBeNumber_1.default('α', α);
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.β -= M.β * α;
            return this;
        };
        G2.prototype.sub2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.β = a.β - b.β;
            return this;
        };
        G2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.β = 0;
                    }
                    break;
                case 1:
                    {
                        this.α = 0;
                        this.β = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.x = 0;
                    this.y = 0;
                    this.β = 0;
                }
            }
            return this;
        };
        G2.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.__add__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.fromScalar(rhs).add(this);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    return rhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        G2.prototype.__div__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scale(rhs);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    return this.__mul__(rhsCopy);
                }
                else {
                    return void 0;
                }
            }
        };
        G2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                return G2.copy(this).scale(lhs);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    return lhsCopy.mul(this);
                }
                else {
                    return void 0;
                }
            }
        };
        G2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).add(this);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    return lhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        G2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.fromScalar(-rhs).add(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                return G2.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).lco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).rco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scp(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__bang__ = function () {
            return G2.copy(this).inv();
        };
        G2.prototype.__tilde__ = function () {
            return G2.copy(this).rev();
        };
        G2.prototype.__pos__ = function () {
            return G2.copy(this);
        };
        G2.prototype.__neg__ = function () {
            return G2.copy(this).neg();
        };
        G2.fromCartesian = function (α, x, y, β) {
            var m = new G2();
            m.α = α;
            m.x = x;
            m.y = y;
            m.β = β;
            return m;
        };
        G2.copy = function (M) {
            var copy = new G2();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.β = M.β;
            return copy;
        };
        G2.fromScalar = function (α) {
            return new G2().addScalar(α);
        };
        G2.fromSpinor = function (spinor) {
            return new G2().copySpinor(spinor);
        };
        G2.fromVector = function (vector) {
            if (isDefined_1.default(vector)) {
                return new G2().copyVector(vector);
            }
            else {
                return void 0;
            }
        };
        G2.lerp = function (A, B, α) {
            return G2.copy(A).lerp(B, α);
        };
        G2.rotorFromDirections = function (a, b) {
            return new G2().rotorFromDirections(a, b);
        };
        G2.BASIS_LABELS = STANDARD_LABELS;
        G2.zero = G2.fromCartesian(0, 0, 0, 0);
        G2.one = G2.fromCartesian(1, 0, 0, 0);
        G2.e1 = G2.fromCartesian(0, 1, 0, 0);
        G2.e2 = G2.fromCartesian(0, 0, 1, 0);
        G2.I = G2.fromCartesian(0, 0, 0, 1);
        return G2;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G2;
});
