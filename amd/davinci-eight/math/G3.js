var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './dotVectorE3', './Euclidean3', '../utils/EventEmitter', './extG3', './lcoG3', './isScalarG3', './mulG3', '../checks/mustBeInteger', '../checks/mustBeString', './quadVectorE3', './rcoG3', '../i18n/readOnly', './rotorFromDirections', './scpG3', './squaredNormG3', './stringFromCoordinates', './VectorN', './wedgeXY', './wedgeYZ', './wedgeZX'], function (require, exports, dotVectorE3_1, Euclidean3_1, EventEmitter_1, extG3_1, lcoG3_1, isScalarG3_1, mulG3_1, mustBeInteger_1, mustBeString_1, quadVectorE3_1, rcoG3_1, readOnly_1, rotorFromDirections_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, VectorN_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    var EVENT_NAME_CHANGE = 'change';
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var cos = Math.cos;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    function coordinates(m) {
        return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
    }
    function makeConstantE3(label, α, x, y, z, yz, zx, xy, β) {
        mustBeString_1.default('label', label);
        var that;
        that = {
            get α() {
                return α;
            },
            set α(unused) {
                throw new Error(readOnly_1.default(label + '.α').message);
            },
            get x() {
                return x;
            },
            set x(unused) {
                throw new Error(readOnly_1.default(label + '.x').message);
            },
            get y() {
                return y;
            },
            set y(unused) {
                throw new Error(readOnly_1.default(label + '.y').message);
            },
            get z() {
                return z;
            },
            set z(unused) {
                throw new Error(readOnly_1.default(label + '.x').message);
            },
            get yz() {
                return yz;
            },
            set yz(unused) {
                throw new Error(readOnly_1.default(label + '.yz').message);
            },
            get zx() {
                return zx;
            },
            set zx(unused) {
                throw new Error(readOnly_1.default(label + '.zx').message);
            },
            get xy() {
                return xy;
            },
            set xy(unused) {
                throw new Error(readOnly_1.default(label + '.xy').message);
            },
            get β() {
                return β;
            },
            set β(unused) {
                throw new Error(readOnly_1.default(label + '.β').message);
            },
            toString: function () {
                return label;
            }
        };
        return that;
    }
    var zero = makeConstantE3('0', 0, 0, 0, 0, 0, 0, 0, 0);
    var one = makeConstantE3('1', 1, 0, 0, 0, 0, 0, 0, 0);
    var e1 = makeConstantE3('e1', 0, 1, 0, 0, 0, 0, 0, 0);
    var e2 = makeConstantE3('e2', 0, 0, 1, 0, 0, 0, 0, 0);
    var e3 = makeConstantE3('e2', 0, 0, 0, 1, 0, 0, 0, 0);
    var I = makeConstantE3('I', 0, 0, 0, 0, 0, 0, 0, 1);
    var G3 = (function (_super) {
        __extends(G3, _super);
        function G3() {
            _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
            this.eventBus = new EventEmitter_1.default(this);
        }
        G3.prototype.on = function (eventName, callback) {
            this.eventBus.addEventListener(eventName, callback);
        };
        G3.prototype.off = function (eventName, callback) {
            this.eventBus.removeEventListener(eventName, callback);
        };
        G3.prototype.setCoordinate = function (index, newValue, name) {
            var coords = this.coords;
            var previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
                this.modified = true;
                this.eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
            }
        };
        Object.defineProperty(G3.prototype, "α", {
            get: function () {
                return this.coords[COORD_W];
            },
            set: function (α) {
                this.setCoordinate(COORD_W, α, 'α');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (x) {
                this.setCoordinate(COORD_X, x, 'x');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (y) {
                this.setCoordinate(COORD_Y, y, 'y');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            get: function () {
                return this.coords[COORD_Z];
            },
            set: function (z) {
                this.setCoordinate(COORD_Z, z, 'z');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                this.setCoordinate(COORD_YZ, yz, 'yz');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                this.setCoordinate(COORD_ZX, zx, 'zx');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                this.setCoordinate(COORD_XY, xy, 'xy');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
            get: function () {
                return this.coords[COORD_XYZ];
            },
            set: function (β) {
                this.setCoordinate(COORD_XYZ, β, 'β');
            },
            enumerable: true,
            configurable: true
        });
        G3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.z += M.z * α;
            this.yz += M.yz * α;
            this.zx += M.zx * α;
            this.xy += M.xy * α;
            this.β += M.β * α;
            return this;
        };
        G3.prototype.addPseudo = function (β) {
            this.β += β;
            return this;
        };
        G3.prototype.addScalar = function (α) {
            this.α += α;
            return this;
        };
        G3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            this.x += v.x * α;
            this.y += v.y * α;
            this.z += v.z * α;
            return this;
        };
        G3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.β = a.β + b.β;
            return this;
        };
        G3.prototype.adj = function () {
            throw new Error('TODO: G3.adj');
        };
        G3.prototype.angle = function () {
            return this.log().grade(2);
        };
        G3.prototype.clone = function () {
            return G3.copy(this);
        };
        G3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        G3.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        G3.prototype.lco2 = function (a, b) {
            return lcoG3_1.default(a, b, this);
        };
        G3.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        G3.prototype.rco2 = function (a, b) {
            return rcoG3_1.default(a, b, this);
        };
        G3.prototype.copy = function (M) {
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.β = M.β;
            return this;
        };
        G3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        G3.prototype.copySpinor = function (spinor) {
            this.zero();
            this.α = spinor.α;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            return this;
        };
        G3.prototype.copyVector = function (vector) {
            this.zero();
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
            return this;
        };
        G3.prototype.div = function (m) {
            if (isScalarG3_1.default(m)) {
                return this.divByScalar(m.α);
            }
            else {
                throw new Error("division with arbitrary multivectors is not supported");
            }
        };
        G3.prototype.divByScalar = function (α) {
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.β /= α;
            return this;
        };
        G3.prototype.div2 = function (a, b) {
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
        G3.prototype.dual = function (m) {
            var w = -m.β;
            var x = -m.yz;
            var y = -m.zx;
            var z = -m.xy;
            var yz = m.x;
            var zx = m.y;
            var xy = m.z;
            var β = m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.β = β;
            return this;
        };
        G3.prototype.exp = function () {
            var expW = exp(this.α);
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var φ = sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? sin(φ) / φ : 1;
            var cosφ = cos(φ);
            this.α = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        };
        G3.prototype.inv = function () {
            this.conj();
            return this;
        };
        G3.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3.prototype.lerp = function (target, α) {
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        G3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        G3.prototype.log = function () {
            var α = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var BB = x * x + y * y + z * z;
            var B = sqrt(BB);
            var f = atan2(B, α) / B;
            this.α = log(sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        };
        G3.prototype.magnitude = function () {
            return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        G3.prototype.mul2 = function (a, b) {
            return mulG3_1.default(a, b, this);
        };
        G3.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        G3.prototype.norm = function () {
            this.α = this.magnitudeSansUnits();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        G3.prototype.direction = function () {
            var norm = this.magnitudeSansUnits();
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.z = this.z / norm;
            this.yz = this.yz / norm;
            this.zx = this.zx / norm;
            this.xy = this.xy / norm;
            this.β = this.β / norm;
            return this;
        };
        G3.prototype.one = function () {
            this.α = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        G3.prototype.quad = function () {
            return this.squaredNorm();
        };
        G3.prototype.squaredNorm = function () {
            this.α = this.squaredNormSansUnits();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        G3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        G3.prototype.reflect = function (n) {
            var N = Euclidean3_1.default.fromVectorE3(n);
            var M = Euclidean3_1.default.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        G3.prototype.rev = function () {
            this.α = +this.α;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        G3.prototype.__tilde__ = function () {
            return G3.copy(this).rev();
        };
        G3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.α;
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;
            return this;
        };
        G3.prototype.rotorFromDirections = function (b, a) {
            return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        G3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.α = cos(φ);
            return this;
        };
        G3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        G3.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        G3.prototype.scp2 = function (a, b) {
            return scpG3_1.default(a, b, this);
        };
        G3.prototype.scale = function (α) {
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.β *= α;
            return this;
        };
        G3.prototype.slerp = function (target, α) {
            return this;
        };
        G3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.zero();
            this.α = dotVectorE3_1.default(a, b);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        G3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.β -= M.β * α;
            return this;
        };
        G3.prototype.sub2 = function (a, b) {
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.β = a.β - b.β;
            return this;
        };
        G3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.β = 0;
                    }
                    break;
                case 1:
                    {
                        this.α = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.β = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.β = 0;
                    }
                    break;
                case 3:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.β = 0;
                }
            }
            return this;
        };
        G3.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        G3.prototype.ext2 = function (a, b) {
            return extG3_1.default(a, b, this);
        };
        G3.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).add(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).add(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.fromScalar(rhs).neg().add(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).lco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).rco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scp(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__bang__ = function () {
            return G3.copy(this).inv();
        };
        G3.prototype.__pos__ = function () {
            return G3.copy(this);
        };
        G3.prototype.__neg__ = function () {
            return G3.copy(this).neg();
        };
        Object.defineProperty(G3, "zero", {
            get: function () { return G3.copy(zero); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "one", {
            get: function () { return G3.copy(one); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e1", {
            get: function () { return G3.copy(e1); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e2", {
            get: function () { return G3.copy(e2); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e3", {
            get: function () { return G3.copy(e3); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "I", {
            get: function () { return G3.copy(I); },
            enumerable: true,
            configurable: true
        });
        ;
        G3.copy = function (M) {
            var copy = new G3();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.z = M.z;
            copy.yz = M.yz;
            copy.zx = M.zx;
            copy.xy = M.xy;
            copy.β = M.β;
            return copy;
        };
        G3.fromScalar = function (α) {
            return new G3().copyScalar(α);
        };
        G3.fromSpinor = function (spinor) {
            var copy = new G3();
            copy.α = spinor.α;
            copy.yz = spinor.yz;
            copy.zx = spinor.yz;
            copy.xy = spinor.xy;
            return copy;
        };
        G3.fromVector = function (vector) {
            var copy = new G3();
            copy.x = vector.x;
            copy.y = vector.y;
            copy.z = vector.z;
            return copy;
        };
        G3.lerp = function (A, B, α) {
            return G3.copy(A).lerp(B, α);
        };
        G3.rotorFromDirections = function (a, b) {
            return new G3().rotorFromDirections(a, b);
        };
        return G3;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G3;
});
