define(["require", "exports", '../geometries/b2', '../geometries/b3', './extE2', '../checks/isDefined', './lcoE2', './rcoE2', './Mat4R', './mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../i18n/notImplemented', '../i18n/readOnly', './R4', './scpE2', './stringFromCoordinates', './tauR4', './Unit'], function (require, exports, b2_1, b3_1, extE2_1, isDefined_1, lcoE2_1, rcoE2_1, Mat4R_1, mulE2_1, mustBeInteger_1, mustBeNumber_1, notImplemented_1, readOnly_1, R4_1, scpE2_1, stringFromCoordinates_1, tauR4_1, Unit_1) {
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    function assertArgEuclidean2(name, arg) {
        if (arg instanceof Euclidean2) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Euclidean2");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit_1.default) {
            return uom;
        }
        else {
            throw new Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
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
    var Euclidean2 = (function () {
        function Euclidean2(α, x, y, β, uom) {
            this._w = mustBeNumber_1.default('α', α);
            this._x = mustBeNumber_1.default('x', x);
            this._y = mustBeNumber_1.default('y', y);
            this.xy = mustBeNumber_1.default('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._w *= multiplier;
                this._x *= multiplier;
                this._y *= multiplier;
                this.xy *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean2, "zero", {
            get: function () {
                return Euclidean2._zero;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zero').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2, "one", {
            get: function () {
                return Euclidean2._one;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('one').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2, "e1", {
            get: function () {
                return Euclidean2._e1;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e1').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2, "e2", {
            get: function () {
                return Euclidean2._e2;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e2').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2, "I", {
            get: function () {
                return Euclidean2._I;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('I').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "α", {
            get: function () {
                return this._w;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "β", {
            get: function () {
                return this.xy;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Euclidean2.prototype.fromCartesian = function (α, x, y, β, uom) {
            mustBeNumber_1.default('α', α);
            mustBeNumber_1.default('x', x);
            mustBeNumber_1.default('y', y);
            mustBeNumber_1.default('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(α, x, y, β, uom);
        };
        Euclidean2.prototype.fromPolar = function (α, r, θ, β, uom) {
            mustBeNumber_1.default('α', α);
            mustBeNumber_1.default('r', r);
            mustBeNumber_1.default('θ', θ);
            mustBeNumber_1.default('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(α, r * cos(θ), r * sin(θ), β, uom);
        };
        Object.defineProperty(Euclidean2.prototype, "coords", {
            get: function () {
                return [this._w, this._x, this._y, this.xy];
            },
            enumerable: true,
            configurable: true
        });
        Euclidean2.prototype.coordinate = function (index) {
            mustBeNumber_1.default('index', index);
            switch (index) {
                case 0:
                    return this._w;
                case 1:
                    return this._x;
                case 2:
                    return this._y;
                case 3:
                    return this.xy;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        Euclidean2.add = function (a, b) {
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
        Euclidean2.prototype.add = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.add(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.addPseudo = function (β) {
            return new Euclidean2(this._w, this._x, this._y, this.β + β, this.uom);
        };
        Euclidean2.prototype.addScalar = function (α) {
            return new Euclidean2(this._w + α, this._x, this._y, this.β, this.uom);
        };
        Euclidean2.prototype.adj = function () {
            throw new Error("TODO: adj");
        };
        Euclidean2.prototype.__add__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).add(this);
            }
        };
        Euclidean2.prototype.angle = function () {
            return this.log().grade(2);
        };
        Euclidean2.prototype.clone = function () {
            return this;
        };
        Euclidean2.prototype.conj = function () {
            throw new Error(notImplemented_1.default('conj').message);
        };
        Euclidean2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this._w, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3_1.default(t, this._x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this._y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.xy, controlBegin.β, controlEnd.β, endPoint.β);
            return new Euclidean2(α, x, y, β, this.uom);
        };
        Euclidean2.prototype.direction = function () {
            var m = this.magnitudeSansUnits();
            if (m !== 1) {
                return new Euclidean2(this.α / m, this.x / m, this.y / m, this.β / m);
            }
            else {
                if (this.uom) {
                    return new Euclidean2(this.α, this.x, this.y, this.β);
                }
                else {
                    return this;
                }
            }
        };
        Euclidean2.prototype.distanceTo = function (point) {
            throw new Error(notImplemented_1.default('diistanceTo').message);
        };
        Euclidean2.prototype.equals = function (point) {
            throw new Error(notImplemented_1.default('equals').message);
        };
        Euclidean2.sub = function (a, b) {
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
        Euclidean2.prototype.sub = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.sub(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).sub(this);
            }
        };
        Euclidean2.prototype.mul = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var a0 = this._w;
            var a1 = this._x;
            var a2 = this._y;
            var a3 = this.xy;
            var b0 = rhs._w;
            var b1 = rhs._x;
            var b2 = rhs._y;
            var b3 = rhs.xy;
            var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return new Euclidean2(c0, c1, c2, c3, Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        Euclidean2.prototype.scale = function (α) {
            return new Euclidean2(this._w * α, this._x * α, this._y * α, this.xy * α, this.uom);
        };
        Euclidean2.prototype.div = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            return this.mul(rhs.inv());
        };
        Euclidean2.prototype.divByScalar = function (α) {
            return new Euclidean2(this._w / α, this._x / α, this._y / α, this.xy / α, this.uom);
        };
        Euclidean2.prototype.__div__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.div(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).div(this);
            }
        };
        Euclidean2.prototype.scp = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var a0 = this._w;
            var a1 = this._x;
            var a2 = this._y;
            var a3 = this.xy;
            var b0 = this._w;
            var b1 = this._x;
            var b2 = this._y;
            var b3 = this.xy;
            var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            return new Euclidean2(c0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.ext = function (a, b) {
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
        Euclidean2.prototype.ext = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.ext(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.ext(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.ext(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.ext(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).ext(this);
            }
        };
        Euclidean2.lshift = function (a, b) {
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
        Euclidean2.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        Euclidean2.prototype.lco = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.lshift(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.lco(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lco(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.lco(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).lco(this);
            }
        };
        Euclidean2.rshift = function (a, b) {
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
        Euclidean2.prototype.rco = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.rshift(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.rco(other);
            }
            else if (typeof other === 'number') {
                return this.rco(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.rco(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).rco(this);
            }
        };
        Euclidean2.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.scp(other);
            }
            else if (typeof other === 'number') {
                return this.scp(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.scp(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).scp(this);
            }
        };
        Euclidean2.prototype.pow = function (exponent) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        Euclidean2.prototype.__bang__ = function () {
            return this.inv();
        };
        Euclidean2.prototype.__pos__ = function () {
            return this;
        };
        Euclidean2.prototype.neg = function () {
            return new Euclidean2(-this._w, -this._x, -this._y, -this.β, this.uom);
        };
        Euclidean2.prototype.__neg__ = function () {
            return this.neg();
        };
        Euclidean2.prototype.__tilde__ = function () {
            return this.rev();
        };
        Euclidean2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    return new Euclidean2(this._w, 0, 0, 0, this.uom);
                case 1:
                    return new Euclidean2(0, this._x, this._y, 0, this.uom);
                case 2:
                    return new Euclidean2(0, 0, 0, this.β, this.uom);
                default:
                    return new Euclidean2(0, 0, 0, 0, this.uom);
            }
        };
        Euclidean2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        Euclidean2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        Euclidean2.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var expα = exp(this._w);
            var cosβ = cos(this.β);
            var sinβ = sin(this.β);
            return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        Euclidean2.prototype.inv = function () {
            var matrix = Mat4R_1.default.zero();
            tauR4_1.default(this.α, this.x, this.y, this.β, matrix);
            matrix.inv();
            var X = new R4_1.default([1, 0, 0, 0]).applyMatrix(matrix);
            var α = X.getComponent(0);
            var x = X.getComponent(1);
            var y = X.getComponent(2);
            var β = X.getComponent(3);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new Euclidean2(α, x, y, β, uom);
        };
        Euclidean2.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        Euclidean2.prototype.magnitude = function () {
            return this.norm();
        };
        Euclidean2.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Euclidean2.prototype.norm = function () {
            return new Euclidean2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        Euclidean2.prototype.quad = function () {
            return this.squaredNorm();
        };
        Euclidean2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this._w, controlPoint.α, endPoint.α);
            var x = b2_1.default(t, this._x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this._y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.xy, controlPoint.β, endPoint.β);
            return new Euclidean2(α, x, y, β, this.uom);
        };
        Euclidean2.prototype.squaredNorm = function () {
            return new Euclidean2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean2.prototype.squaredNormSansUnits = function () {
            var α = this._w;
            var x = this._x;
            var y = this._y;
            var β = this.β;
            return α * α + x * x + y * y + β * β;
        };
        Euclidean2.prototype.reflect = function (n) {
            var m = Euclidean2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        Euclidean2.prototype.rev = function () {
            return new Euclidean2(this._w, this._x, this._y, -this.β, this.uom);
        };
        Euclidean2.prototype.rotate = function (R) {
            throw new Error(notImplemented_1.default('rotate').message);
        };
        Euclidean2.prototype.sin = function () {
            throw new Error(notImplemented_1.default('sin').message);
        };
        Euclidean2.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        Euclidean2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Euclidean2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        Euclidean2.prototype.isOne = function () { return this._w === 1 && this._x === 0 && this._y === 0 && this.xy === 0; };
        Euclidean2.prototype.isNaN = function () { return isNaN(this._w) || isNaN(this._x) || isNaN(this._y) || isNaN(this.xy); };
        Euclidean2.prototype.isZero = function () { return this._w === 0 && this._x === 0 && this._y === 0 && this.xy === 0; };
        Euclidean2.prototype.toStringCustom = function (coordToString, labels) {
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
        Euclidean2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toStringIJK = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        Euclidean2.prototype.toStringLATEX = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        Euclidean2.copy = function (m) {
            if (m instanceof Euclidean2) {
                return m;
            }
            else {
                return new Euclidean2(m.α, m.x, m.y, m.β, void 0);
            }
        };
        Euclidean2.fromVectorE2 = function (vector) {
            if (isDefined_1.default(vector)) {
                if (vector instanceof Euclidean2) {
                    return new Euclidean2(0, vector.x, vector.y, 0, vector.uom);
                }
                else {
                    return new Euclidean2(0, vector.x, vector.y, 0, void 0);
                }
            }
            else {
                return void 0;
            }
        };
        Euclidean2._zero = new Euclidean2(0, 0, 0, 0);
        Euclidean2._one = new Euclidean2(1, 0, 0, 0);
        Euclidean2._e1 = new Euclidean2(0, 1, 0, 0);
        Euclidean2._e2 = new Euclidean2(0, 0, 1, 0);
        Euclidean2._I = new Euclidean2(0, 0, 0, 1);
        Euclidean2.kilogram = new Euclidean2(1, 0, 0, 0, Unit_1.default.KILOGRAM);
        Euclidean2.meter = new Euclidean2(1, 0, 0, 0, Unit_1.default.METER);
        Euclidean2.second = new Euclidean2(1, 0, 0, 0, Unit_1.default.SECOND);
        Euclidean2.coulomb = new Euclidean2(1, 0, 0, 0, Unit_1.default.COULOMB);
        Euclidean2.ampere = new Euclidean2(1, 0, 0, 0, Unit_1.default.AMPERE);
        Euclidean2.kelvin = new Euclidean2(1, 0, 0, 0, Unit_1.default.KELVIN);
        Euclidean2.mole = new Euclidean2(1, 0, 0, 0, Unit_1.default.MOLE);
        Euclidean2.candela = new Euclidean2(1, 0, 0, 0, Unit_1.default.CANDELA);
        return Euclidean2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Euclidean2;
});
