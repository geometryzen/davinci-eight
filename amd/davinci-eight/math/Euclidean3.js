define(["require", "exports", '../math/addE3', '../geometries/b2', '../geometries/b3', '../math/extG3', '../checks/isDefined', '../math/lcoG3', '../math/mulE3', '../math/mulG3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/NotImplementedError', '../math/rcoG3', '../i18n/readOnly', '../math/scpG3', '../math/squaredNormG3', '../math/stringFromCoordinates', '../math/subE3', '../math/Unit', '../math/BASIS_LABELS_G3_GEOMETRIC', '../math/BASIS_LABELS_G3_HAMILTON', '../math/BASIS_LABELS_G3_STANDARD', '../math/BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, addE3_1, b2_1, b3_1, extG3_1, isDefined_1, lcoG3_1, mulE3_1, mulG3_1, mustBeInteger_1, mustBeNumber_1, NotImplementedError_1, rcoG3_1, readOnly_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, subE3_1, Unit_1, BASIS_LABELS_G3_GEOMETRIC_1, BASIS_LABELS_G3_HAMILTON_1, BASIS_LABELS_G3_STANDARD_1, BASIS_LABELS_G3_STANDARD_HTML_1) {
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    function assertArgEuclidean3(name, arg) {
        if (arg instanceof Euclidean3) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Euclidean3");
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
    function compute(f, a, b, coord, pack, uom) {
        var a0 = coord(a, 0);
        var a1 = coord(a, 1);
        var a2 = coord(a, 2);
        var a3 = coord(a, 3);
        var a4 = coord(a, 4);
        var a5 = coord(a, 5);
        var a6 = coord(a, 6);
        var a7 = coord(a, 7);
        var b0 = coord(b, 0);
        var b1 = coord(b, 1);
        var b2 = coord(b, 2);
        var b3 = coord(b, 3);
        var b4 = coord(b, 4);
        var b5 = coord(b, 5);
        var b6 = coord(b, 6);
        var b7 = coord(b, 7);
        var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
    }
    var divide = function (a000, a001, a010, a011, a100, a101, a110, a111, b000, b001, b010, b011, b100, b101, b110, b111, uom) {
        var c000;
        var c001;
        var c010;
        var c011;
        var c100;
        var c101;
        var c110;
        var c111;
        var i000;
        var i001;
        var i010;
        var i011;
        var i100;
        var i101;
        var i110;
        var i111;
        var k000;
        var m000;
        var m001;
        var m010;
        var m011;
        var m100;
        var m101;
        var m110;
        var m111;
        var r000;
        var r001;
        var r010;
        var r011;
        var r100;
        var r101;
        var r110;
        var r111;
        var s000;
        var s001;
        var s010;
        var s011;
        var s100;
        var s101;
        var s110;
        var s111;
        var w;
        var x;
        var x000;
        var x001;
        var x010;
        var x011;
        var x100;
        var x101;
        var x110;
        var x111;
        var xy;
        var β;
        var y;
        var yz;
        var z;
        var zx;
        r000 = +b000;
        r001 = +b001;
        r010 = +b010;
        r011 = -b011;
        r100 = +b100;
        r101 = -b101;
        r110 = -b110;
        r111 = -b111;
        m000 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        s000 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        k000 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        x000 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        w = x000;
        x = x001;
        y = x010;
        z = x100;
        xy = x011;
        yz = x110;
        zx = -x101;
        β = x111;
        return new Euclidean3(w, x, y, z, xy, yz, zx, β, uom);
    };
    var Euclidean3 = (function () {
        function Euclidean3(α, x, y, z, xy, yz, zx, β, uom) {
            this.w = mustBeNumber_1.default('α', α);
            this.x = mustBeNumber_1.default('x', x);
            this.y = mustBeNumber_1.default('y', y);
            this.z = mustBeNumber_1.default('z', z);
            this.xy = mustBeNumber_1.default('xy', xy);
            this.yz = mustBeNumber_1.default('yz', yz);
            this.zx = mustBeNumber_1.default('zx', zx);
            this.xyz = mustBeNumber_1.default('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.z *= multiplier;
                this.xy *= multiplier;
                this.yz *= multiplier;
                this.zx *= multiplier;
                this.xyz *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3.prototype, "α", {
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean3.prototype, "β", {
            get: function () {
                return this.xyz;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Euclidean3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            mustBeNumber_1.default('α', α);
            mustBeNumber_1.default('x', x);
            mustBeNumber_1.default('y', y);
            mustBeNumber_1.default('z', z);
            mustBeNumber_1.default('xy', xy);
            mustBeNumber_1.default('yz', yz);
            mustBeNumber_1.default('zx', zx);
            mustBeNumber_1.default('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(Euclidean3.prototype, "coords", {
            get: function () {
                return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
            },
            enumerable: true,
            configurable: true
        });
        Euclidean3.prototype.coordinate = function (index) {
            mustBeNumber_1.default('index', index);
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.z;
                case 4:
                    return this.xy;
                case 5:
                    return this.yz;
                case 6:
                    return this.zx;
                case 7:
                    return this.xyz;
                default:
                    throw new Error("index must be in the range [0..7]");
            }
        };
        Euclidean3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.addPseudo = function (β) {
            if (isDefined_1.default(β)) {
                mustBeNumber_1.default('β', β);
                return new Euclidean3(this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz + β, this.uom);
            }
            else {
                return void 0;
            }
        };
        Euclidean3.prototype.addScalar = function (α) {
            if (isDefined_1.default(α)) {
                mustBeNumber_1.default('α', α);
                return new Euclidean3(this.w + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz, this.uom);
            }
            else {
                return void 0;
            }
        };
        Euclidean3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.add(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(rhs);
            }
        };
        Euclidean3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.add(this);
            }
            else if (typeof lhs === 'number') {
                return this.addScalar(lhs);
            }
        };
        Euclidean3.prototype.adj = function () {
            return this;
        };
        Euclidean3.prototype.angle = function () {
            return this.log().grade(2);
        };
        Euclidean3.prototype.conj = function () {
            return new Euclidean3(this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.xyz, this.uom);
        };
        Euclidean3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = b3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.direction = function () {
            return this.div(this.norm());
        };
        Euclidean3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(-rhs);
            }
        };
        Euclidean3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.sub(this);
            }
            else if (typeof lhs === 'number') {
                return this.neg().addScalar(lhs);
            }
        };
        Euclidean3.prototype.mul = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            mulG3_1.default(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        Euclidean3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        Euclidean3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        Euclidean3.prototype.scale = function (α) {
            return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
        };
        Euclidean3.prototype.div = function (rhs) {
            assertArgEuclidean3('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit_1.default.div(this.uom, rhs.uom));
        };
        Euclidean3.prototype.divByScalar = function (α) {
            return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
        };
        Euclidean3.prototype.__div__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        Euclidean3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        Euclidean3.prototype.dual = function () {
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.scp = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            scpG3_1.default(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        Euclidean3.prototype.ext = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            extG3_1.default(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        Euclidean3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        Euclidean3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        Euclidean3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        Euclidean3.prototype.lco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            lcoG3_1.default(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        Euclidean3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        Euclidean3.prototype.rco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            rcoG3_1.default(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        Euclidean3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        Euclidean3.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        Euclidean3.prototype.__bang__ = function () {
            return this.inv();
        };
        Euclidean3.prototype.__pos__ = function () {
            return this;
        };
        Euclidean3.prototype.neg = function () {
            return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.__neg__ = function () {
            return this.neg();
        };
        Euclidean3.prototype.rev = function () {
            return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.__tilde__ = function () {
            return this.rev();
        };
        Euclidean3.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    return Euclidean3.fromCartesian(this.w, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return Euclidean3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.xyz, this.uom);
                default:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        Euclidean3.prototype.cross = function (vector) {
            var x;
            var x1;
            var x2;
            var y;
            var y1;
            var y2;
            var z;
            var z1;
            var z2;
            x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit_1.default.mul(this.uom, vector.uom));
        };
        Euclidean3.prototype.isOne = function () {
            return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        Euclidean3.prototype.isZero = function () {
            return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        Euclidean3.prototype.lerp = function (target, α) {
            return this;
        };
        Euclidean3.prototype.cos = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var cosW = cos(this.w);
            return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.cosh = function () {
            throw new NotImplementedError_1.default('cosh(Euclidean3)');
        };
        Euclidean3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return sqrt(dx * dx + dy * dy + dz * dz);
        };
        Euclidean3.prototype.equals = function (other) {
            throw new Error("TODO: Euclidean3.equals");
        };
        Euclidean3.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.direction();
                return c.add(B.mul(s));
            }
            else {
                return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        Euclidean3.prototype.inv = function () {
            return this.rev().divByScalar(this.squaredNormSansUnits());
        };
        Euclidean3.prototype.log = function () {
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.magnitude = function () {
            return this.norm();
        };
        Euclidean3.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Euclidean3.prototype.norm = function () {
            return new Euclidean3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.quad = function () {
            return this.squaredNorm();
        };
        Euclidean3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var z = b2_1.default(t, this.z, controlPoint.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.squaredNorm = function () {
            return new Euclidean3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        Euclidean3.prototype.reflect = function (n) {
            var m = Euclidean3.fromVectorE3(n);
            return m.mul(this).mul(m).scale(-1);
        };
        Euclidean3.prototype.rotate = function (s) {
            return this;
        };
        Euclidean3.prototype.sin = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var sinW = sin(this.w);
            return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.sinh = function () {
            throw new Error('sinh');
        };
        Euclidean3.prototype.slerp = function (target, α) {
            return this;
        };
        Euclidean3.prototype.sqrt = function () {
            return new Euclidean3(sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.sqrt(this.uom));
        };
        Euclidean3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        Euclidean3.prototype.toStringCustom = function (coordToString, labels) {
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
        Euclidean3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.mutator = function (M) {
            var that = {
                set α(α) {
                    M.w = α;
                },
                set x(x) {
                    M.x = x;
                },
                set y(y) {
                    M.y = y;
                },
                set z(z) {
                    M.z = z;
                },
                set yz(yz) {
                    M.yz = yz;
                },
                set zx(zx) {
                    M.zx = zx;
                },
                set xy(xy) {
                    M.xy = xy;
                },
                set β(β) {
                    M.xyz = β;
                },
            };
            return that;
        };
        Euclidean3.copy = function (m) {
            if (m instanceof Euclidean3) {
                return m;
            }
            else {
                return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0);
            }
        };
        Euclidean3.fromSpinorE3 = function (spinor) {
            if (isDefined_1.default(spinor)) {
                return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        Euclidean3.fromVectorE3 = function (vector) {
            if (isDefined_1.default(vector)) {
                return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        Euclidean3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        Euclidean3.zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);
        Euclidean3.one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);
        Euclidean3.e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        Euclidean3.e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        Euclidean3.e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        Euclidean3.kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KILOGRAM);
        Euclidean3.meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.METER);
        Euclidean3.second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.SECOND);
        Euclidean3.coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.COULOMB);
        Euclidean3.ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.AMPERE);
        Euclidean3.kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KELVIN);
        Euclidean3.mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.MOLE);
        Euclidean3.candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.CANDELA);
        return Euclidean3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Euclidean3;
});
