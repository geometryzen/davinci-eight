define(["require", "exports", '../geometries/b2', '../geometries/b3', './extE2', './gauss', './lcoE2', './rcoE2', './mulE2', '../i18n/notImplemented', '../i18n/readOnly', './scpE2', './stringFromCoordinates', './Unit'], function (require, exports, b2_1, b3_1, extE2_1, gauss_1, lcoE2_1, rcoE2_1, mulE2_1, notImplemented_1, readOnly_1, scpE2_1, stringFromCoordinates_1, Unit_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_PSEUDO = 3;
    function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a00 + b00);
    }
    function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a01 + b01);
    }
    function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a10 + b10);
    }
    function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a11 + b11);
    }
    function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 - b0);
                }
                break;
            case 1:
                {
                    x = +(a1 - b1);
                }
                break;
            case 2:
                {
                    x = +(a2 - b2);
                }
                break;
            case 3:
                {
                    x = +(a3 - b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    var G2 = (function () {
        function G2(α, x, y, β, uom) {
            if (α === void 0) { α = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (β === void 0) { β = 0; }
            this._coords = [0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G2, "zero", {
            get: function () {
                return G2._zero;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zero').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "one", {
            get: function () {
                return G2._one;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('one').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e1", {
            get: function () {
                return G2._e1;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e1').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e2", {
            get: function () {
                return G2._e2;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e2').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "I", {
            get: function () {
                return G2._I;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('I').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "α", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "alpha", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('alpha').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "beta", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('beta').message);
            },
            enumerable: true,
            configurable: true
        });
        G2.prototype.fromCartesian = function (α, x, y, β, uom) {
            return new G2(α, x, y, β, uom);
        };
        G2.prototype.fromPolar = function (α, r, θ, β, uom) {
            return new G2(α, r * Math.cos(θ), r * Math.sin(θ), β, uom);
        };
        Object.defineProperty(G2.prototype, "coords", {
            get: function () {
                return [this.α, this.x, this.y, this.β];
            },
            enumerable: true,
            configurable: true
        });
        G2.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.α;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.β;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        G2.add = function (a, b) {
            var a00 = a[0];
            var a01 = a[1];
            var a10 = a[2];
            var a11 = a[3];
            var b00 = b[0];
            var b01 = b[1];
            var b10 = b[2];
            var b11 = b[3];
            var x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
            var x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
            var x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
            var x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
            return [x00, x01, x10, x11];
        };
        G2.prototype.add = function (rhs) {
            var xs = G2.add(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.addPseudo = function (β) {
            return new G2(this.α, this.x, this.y, this.β + β, this.uom);
        };
        G2.prototype.addScalar = function (α) {
            return new G2(this.α + α, this.x, this.y, this.β, this.uom);
        };
        G2.prototype.adj = function () {
            throw new Error("TODO: adj");
        };
        G2.prototype.__add__ = function (other) {
            if (other instanceof G2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__radd__ = function (other) {
            if (other instanceof G2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).add(this);
            }
        };
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        G2.prototype.clone = function () {
            return this;
        };
        G2.prototype.conj = function () {
            throw new Error(notImplemented_1.default('conj').message);
        };
        G2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.direction = function () {
            var m = this.magnitudeSansUnits();
            if (m !== 1) {
                return new G2(this.α / m, this.x / m, this.y / m, this.β / m);
            }
            else {
                if (this.uom) {
                    return new G2(this.α, this.x, this.y, this.β);
                }
                else {
                    return this;
                }
            }
        };
        G2.prototype.distanceTo = function (point) {
            throw new Error(notImplemented_1.default('diistanceTo').message);
        };
        G2.prototype.equals = function (point) {
            throw new Error(notImplemented_1.default('equals').message);
        };
        G2.sub = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.sub = function (rhs) {
            var xs = G2.sub(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.__sub__ = function (other) {
            if (other instanceof G2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rsub__ = function (other) {
            if (other instanceof G2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).sub(this);
            }
        };
        G2.prototype.mul = function (rhs) {
            var a0 = this.α;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.β;
            var b0 = rhs.α;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.β;
            var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return new G2(c0, c1, c2, c3, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__mul__ = function (other) {
            if (other instanceof G2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rmul__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        G2.prototype.scale = function (α) {
            return new G2(this.α * α, this.x * α, this.y * α, this.β * α, this.uom);
        };
        G2.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G2.prototype.divByScalar = function (α) {
            return new G2(this.α / α, this.x / α, this.y / α, this.β / α, this.uom);
        };
        G2.prototype.__div__ = function (other) {
            if (other instanceof G2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rdiv__ = function (other) {
            if (other instanceof G2) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).div(this);
            }
        };
        G2.prototype.scp = function (rhs) {
            var a0 = this.α;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.β;
            var b0 = rhs.α;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.β;
            var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            return new G2(c0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.ext = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.ext = function (rhs) {
            var xs = G2.ext(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__wedge__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.ext(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.ext(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rwedge__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.ext(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).ext(this);
            }
        };
        G2.lshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G2.prototype.lco = function (rhs) {
            var xs = G2.lshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__lshift__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.lco(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lco(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rlshift__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.lco(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).lco(this);
            }
        };
        G2.rshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.rco = function (rhs) {
            var xs = G2.rshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__rshift__ = function (other) {
            if (other instanceof G2) {
                return this.rco(other);
            }
            else if (typeof other === 'number') {
                return this.rco(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rrshift__ = function (other) {
            if (other instanceof G2) {
                return other.rco(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).rco(this);
            }
        };
        G2.prototype.__vbar__ = function (other) {
            if (other instanceof G2) {
                return this.scp(other);
            }
            else if (typeof other === 'number') {
                return this.scp(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rvbar__ = function (other) {
            if (other instanceof G2) {
                return other.scp(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).scp(this);
            }
        };
        G2.prototype.pow = function (exponent) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        G2.prototype.__bang__ = function () {
            return this.inv();
        };
        G2.prototype.__pos__ = function () {
            return this;
        };
        G2.prototype.neg = function () {
            return new G2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        G2.prototype.__neg__ = function () {
            return this.neg();
        };
        G2.prototype.__tilde__ = function () {
            return this.rev();
        };
        G2.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return new G2(this.α, 0, 0, 0, this.uom);
                case 1:
                    return new G2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new G2(0, 0, 0, this.β, this.uom);
                default:
                    return new G2(0, 0, 0, 0, this.uom);
            }
        };
        G2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        G2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G2.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var expα = Math.exp(this.α);
            var cosβ = Math.cos(this.β);
            var sinβ = Math.sin(this.β);
            return new G2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        G2.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G2(X[0], X[1], X[2], X[3], uom);
        };
        G2.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        G2.prototype.magnitude = function () {
            return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.norm = function () {
            return new G2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        G2.prototype.quad = function () {
            return this.squaredNorm();
        };
        G2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.squaredNorm = function () {
            return new G2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G2.prototype.squaredNormSansUnits = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            return α * α + x * x + y * y + β * β;
        };
        G2.prototype.reflect = function (n) {
            var m = G2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G2.prototype.rev = function () {
            return new G2(this.α, this.x, this.y, -this.β, this.uom);
        };
        G2.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var α = spinor.α;
            var β = spinor.β;
            var α2 = α * α;
            var β2 = β * β;
            var p = α2 - β2;
            var q = 2 * α * β;
            var s = α2 + β2;
            return new G2(s * this.α, p * x + q * y, p * y - q * x, s * this.β, this.uom);
        };
        G2.prototype.sin = function () {
            throw new Error(notImplemented_1.default('sin').message);
        };
        G2.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G2.prototype.isOne = function () { return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0; };
        G2.prototype.isNaN = function () { return isNaN(this.α) || isNaN(this.x) || isNaN(this.y) || isNaN(this.β); };
        G2.prototype.isZero = function () { return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0; };
        G2.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
            if (this.uom) {
                var unitString = this.uom.toString().trim();
                if (unitString) {
                    return quantityString + ' ' + unitString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        G2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toStringIJK = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        G2.prototype.toStringLATEX = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        G2.copy = function (m) {
            if (m instanceof G2) {
                return m;
            }
            else {
                return new G2(m.α, m.x, m.y, m.β, void 0);
            }
        };
        G2.fromVectorE2 = function (vector) {
            if (vector) {
                if (vector instanceof G2) {
                    return new G2(0, vector.x, vector.y, 0, vector.uom);
                }
                else {
                    return new G2(0, vector.x, vector.y, 0, void 0);
                }
            }
            else {
                return void 0;
            }
        };
        G2.vector = function (x, y, uom) {
            return new G2(0, x, y, 0, uom);
        };
        G2._zero = new G2(0, 0, 0, 0);
        G2._one = new G2(1, 0, 0, 0);
        G2._e1 = new G2(0, 1, 0, 0);
        G2._e2 = new G2(0, 0, 1, 0);
        G2._I = new G2(0, 0, 0, 1);
        G2.kilogram = new G2(1, 0, 0, 0, Unit_1.default.KILOGRAM);
        G2.meter = new G2(1, 0, 0, 0, Unit_1.default.METER);
        G2.second = new G2(1, 0, 0, 0, Unit_1.default.SECOND);
        G2.coulomb = new G2(1, 0, 0, 0, Unit_1.default.COULOMB);
        G2.ampere = new G2(1, 0, 0, 0, Unit_1.default.AMPERE);
        G2.kelvin = new G2(1, 0, 0, 0, Unit_1.default.KELVIN);
        G2.mole = new G2(1, 0, 0, 0, Unit_1.default.MOLE);
        G2.candela = new G2(1, 0, 0, 0, Unit_1.default.CANDELA);
        return G2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G2;
});
