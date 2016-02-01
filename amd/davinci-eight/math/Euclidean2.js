define(["require", "exports", '../geometries/b2', '../geometries/b3', '../math/extE2', '../checks/isDefined', '../math/lcoE2', '../math/rcoE2', '../math/mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../i18n/readOnly', '../math/scpE2', '../math/stringFromCoordinates', '../math/Unit'], function (require, exports, b2_1, b3_1, extE2_1, isDefined_1, lcoE2_1, rcoE2_1, mulE2_1, mustBeInteger_1, mustBeNumber_1, readOnly_1, scpE2_1, stringFromCoordinates_1, Unit_1) {
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
    function addE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
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
                    x = +(a0 + b0);
                }
                break;
            case 1:
                {
                    x = +(a1 + b1);
                }
                break;
            case 2:
                {
                    x = +(a2 + b2);
                }
                break;
            case 3:
                {
                    x = +(a3 + b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
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
    var divide = function (a00, a01, a10, a11, b00, b01, b10, b11, uom) {
        var c00;
        var c01;
        var c10;
        var c11;
        var i00;
        var i01;
        var i10;
        var i11;
        var k00;
        var m00;
        var m01;
        var m10;
        var m11;
        var r00;
        var r01;
        var r10;
        var r11;
        var s00;
        var s01;
        var s10;
        var s11;
        var x00;
        var x01;
        var x10;
        var x11;
        r00 = +b00;
        r01 = +b01;
        r10 = +b10;
        r11 = -b11;
        m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
        m01 = 0;
        m10 = 0;
        m11 = 0;
        c00 = +m00;
        c01 = -m01;
        c10 = -m10;
        c11 = -m11;
        s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
        s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
        s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
        s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
        k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
        i00 = s00 / k00;
        i01 = s01 / k00;
        i10 = s10 / k00;
        i11 = s11 / k00;
        x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
        x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
        x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
        x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
        return new Euclidean2(x00, x01, x10, x11, uom);
    };
    var Euclidean2 = (function () {
        function Euclidean2(α, x, y, β, uom) {
            this.w = mustBeNumber_1.default('α', α);
            this.x = mustBeNumber_1.default('x', x);
            this.y = mustBeNumber_1.default('y', y);
            this.xy = mustBeNumber_1.default('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.xy *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean2.prototype, "α", {
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
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
                return [this.w, this.x, this.y, this.xy];
            },
            enumerable: true,
            configurable: true
        });
        Euclidean2.prototype.coordinate = function (index) {
            mustBeNumber_1.default('index', index);
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
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
            return new Euclidean2(this.α, this.x, this.y, this.β + β, this.uom);
        };
        Euclidean2.prototype.addScalar = function (α) {
            return new Euclidean2(this.α + α, this.x, this.y, this.β, this.uom);
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
            throw new Error("TODO: adj");
        };
        Euclidean2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.direction = function () {
            throw new Error('direction');
        };
        Euclidean2.prototype.distanceTo = function (point) {
            throw new Error("TODO: Euclidean2.distanceTo");
        };
        Euclidean2.prototype.equals = function (point) {
            throw new Error("TODO: Euclidean2.equals");
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
            var a0 = this.w;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.xy;
            var b0 = rhs.w;
            var b1 = rhs.x;
            var b2 = rhs.y;
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
            return new Euclidean2(this.w * α, this.x * α, this.y * α, this.xy * α, this.uom);
        };
        Euclidean2.prototype.div = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit_1.default.div(this.uom, rhs.uom));
        };
        Euclidean2.prototype.divByScalar = function (α) {
            return new Euclidean2(this.w / α, this.x / α, this.y / α, this.xy / α, this.uom);
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
        Euclidean2.scp = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            var x1 = 0;
            var x2 = 0;
            var x3 = 0;
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.scp = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var a0 = this.w;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.xy;
            var b0 = this.w;
            var b1 = this.x;
            var b2 = this.y;
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
            return this;
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
            throw new Error('pow');
        };
        Euclidean2.prototype.__bang__ = function () {
            return this.inv();
        };
        Euclidean2.prototype.__pos__ = function () {
            return this;
        };
        Euclidean2.prototype.neg = function () {
            return new Euclidean2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.__neg__ = function () {
            return this.neg();
        };
        Euclidean2.prototype.__tilde__ = function () {
            return new Euclidean2(this.α, this.x, this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    return new Euclidean2(this.α, 0, 0, 0, this.uom);
                case 1:
                    return new Euclidean2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new Euclidean2(0, 0, 0, this.β, this.uom);
                default:
                    return new Euclidean2(0, 0, 0, 0, this.uom);
            }
        };
        Euclidean2.prototype.cos = function () {
            throw new Error('cos');
        };
        Euclidean2.prototype.cosh = function () {
            throw new Error('cosh');
        };
        Euclidean2.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var expα = exp(this.α);
            var cosβ = cos(this.β);
            var sinβ = sin(this.β);
            return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        Euclidean2.prototype.inv = function () {
            throw new Error('inv');
        };
        Euclidean2.prototype.log = function () {
            throw new Error('log');
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
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.squaredNorm = function () {
            return new Euclidean2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean2.prototype.squaredNormSansUnits = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            return α * α + x * x + y * y + β * β;
        };
        Euclidean2.prototype.reflect = function (n) {
            var m = Euclidean2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        Euclidean2.prototype.rev = function () {
            throw new Error('rev');
        };
        Euclidean2.prototype.rotate = function (R) {
            throw new Error('rotate');
        };
        Euclidean2.prototype.sin = function () {
            throw new Error('sin');
        };
        Euclidean2.prototype.sinh = function () {
            throw new Error('sinh');
        };
        Euclidean2.prototype.slerp = function (target, α) {
            return this;
        };
        Euclidean2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        Euclidean2.prototype.isOne = function () { return this.w === 1 && this.x === 0 && this.y === 0 && this.xy === 0; };
        Euclidean2.prototype.isNaN = function () { return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy); };
        Euclidean2.prototype.isZero = function () { return this.w === 0 && this.x === 0 && this.y === 0 && this.xy === 0; };
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
        return Euclidean2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Euclidean2;
});
