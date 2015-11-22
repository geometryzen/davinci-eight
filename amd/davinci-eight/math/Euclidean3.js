define(["require", "exports", '../math/addE3', '../geometries/b2', '../geometries/b3', '../math/extG3', '../checks/isDefined', '../math/lcoG3', '../math/mathcore', '../math/mulE3', '../math/mulG3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/NotImplementedError', '../math/rcoG3', '../i18n/readOnly', '../math/scpG3', '../math/squaredNormG3', '../math/stringFromCoordinates', '../math/subE3', '../math/Unit', '../math/BASIS_LABELS_G3_GEOMETRIC', '../math/BASIS_LABELS_G3_HAMILTON', '../math/BASIS_LABELS_G3_STANDARD', '../math/BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, addE3, b2, b3, extG3, isDefined, lcoG3, mathcore, mulE3, mulG3, mustBeInteger, mustBeNumber, NotImplementedError, rcoG3, readOnly, scpG3, squaredNormG3, stringFromCoordinates, subE3, Unit, BASIS_LABELS_G3_GEOMETRIC, BASIS_LABELS_G3_HAMILTON, BASIS_LABELS_G3_STANDARD, BASIS_LABELS_G3_STANDARD_HTML) {
    var cos = Math.cos;
    var cosh = mathcore.Math.cosh;
    var exp = Math.exp;
    var sin = Math.sin;
    var sinh = mathcore.Math.sinh;
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
        if (typeof uom === 'undefined' || uom instanceof Unit) {
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
    // FIXME: Need to use tensor representations to find inverse, if it exists.
    // I don't remember how I came up with this, but part was Hestenes NFCM problem (7.2) p38.
    // Let A = α + a, where a is a non-zero vector.
    // Find inv(A) as a function of α and a.
    // etc
    // Perwass describes how to convert multivectors to a tensor representation and then use
    // matrices to find inverses. Essentially we are invoking theorems on the determinant
    // which apply to the antisymmetric product.
    var divide = function (a000, // a.w
        a001, // a.x
        a010, // a.y
        a011, // a.xy
        a100, // a.z
        a101, // -a.zx or a.xz
        a110, // a.yz
        a111, // a.xyz
        b000, // b.w
        b001, // b.x
        b010, // b.y
        b011, // b.xy
        b100, // b.z
        b101, // -b.zx or b.xz
        b110, // b.yz
        b111, // b.xyz
        uom) {
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
        // This looks like the reversion of b, but there is a strange sign flip for zx
        // r = ~b
        r000 = +b000; // => b.w
        r001 = +b001; // => b.x
        r010 = +b010; // => b.y
        r011 = -b011; // => -b.xy
        r100 = +b100; // => b.z
        r101 = -b101; // => +b.zx
        r110 = -b110; // => -b.yz
        r111 = -b111; // => -b.xyz
        // m = (b * r) grades 0 and 1
        m000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        // Clifford conjugation.
        // c = cc(m)
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        // s = r * c
        s000 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        // k = (b * s), grade 0 part
        k000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        // i = s / k
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        // x = a * i
        x000 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        // this = x
        //      = a * i
        //      = a * s / k
        //      = a * s / grade(b * s, 0)
        //      = a * r * c / grade(b * r * c, 0)
        //      = a * r * cc(b * r) / grade(b * r * cc(b * r), 0)
        //      = a * ~b * cc(b * ~b) / grade(b * ~b * cc(b * ~b), 0)
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
    /**
     * @class Euclidean3
     */
    var Euclidean3 = (function () {
        /**
         * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
         * Constructs a Euclidean3 from its coordinates.
         * @constructor
         * @param {number} α The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} z The vector component of the multivector in the z-direction.
         * @param {number} xy The bivector component of the multivector in the xy-plane.
         * @param {number} yz The bivector component of the multivector in the yz-plane.
         * @param {number} zx The bivector component of the multivector in the zx-plane.
         * @param {number} β The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean3(α, x, y, z, xy, yz, zx, β, uom) {
            this.w = mustBeNumber('α', α);
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.z = mustBeNumber('z', z);
            this.xy = mustBeNumber('xy', xy);
            this.yz = mustBeNumber('yz', yz);
            this.zx = mustBeNumber('zx', zx);
            this.xyz = mustBeNumber('β', β);
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
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3.prototype, "α", {
            /**
             * The scalar part of this multivector.
             * @property α
             * @return {number}
             */
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean3.prototype, "β", {
            /**
             * The pseudoscalar part of this multivector.
             * @property β
             * @return {number}
             */
            get: function () {
                return this.xyz;
            },
            set: function (unused) {
                throw new Error(readOnly('β').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method fromCartesian
         * @param α {number}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param xy {number}
         * @param yz {number}
         * @param zx {number}
         * @param β {number}
         * @param uom [Unit]
         * @return {Euclidean3}
         * @chainable
         * @static
         */
        Euclidean3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            mustBeNumber('α', α);
            mustBeNumber('x', x);
            mustBeNumber('y', y);
            mustBeNumber('z', z);
            mustBeNumber('xy', xy);
            mustBeNumber('yz', yz);
            mustBeNumber('zx', zx);
            mustBeNumber('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(Euclidean3.prototype, "coords", {
            /**
             * @property coords
             * @type {number[]}
             */
            get: function () {
                return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method coordinate
         * @param index {number}
         * @return {number}
         */
        Euclidean3.prototype.coordinate = function (index) {
            mustBeNumber('index', index);
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
        /**
         * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
         * This method does not change this Euclidean3.
         * @method add
         * @param rhs {Euclidean3}
         * @return {Euclidean3} This Euclidean3 plus rhs.
         */
        Euclidean3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * Computes <code>this + Iβ</code>
         * @method addPseudo
         * @param β {number}
         * @return {Euclidean3} <code>this</code>
         * @chainable
         */
        Euclidean3.prototype.addPseudo = function (β) {
            if (isDefined(β)) {
                mustBeNumber('β', β);
                return new Euclidean3(this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz + β, this.uom);
            }
            else {
                // Consider returning an undefined sentinel?
                // This would allow chained methods to continue.
                // The first check might then be isNumber. 
                return void 0;
            }
        };
        /**
         * Computes <code>this + α</code>
         * @method addScalar
         * @param α {number}
         * @return {Euclidean3} <code>this</code>
         * @chainable
         */
        Euclidean3.prototype.addScalar = function (α) {
            if (isDefined(α)) {
                mustBeNumber('α', α);
                return new Euclidean3(this.w + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz, this.uom);
            }
            else {
                // Consider returning an undefined sentinel?
                // This would allow chained methods to continue.
                // The first check might then be isNumber. 
                return void 0;
            }
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.add(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(rhs);
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.add(this);
            }
            else if (typeof lhs === 'number') {
                return this.addScalar(lhs);
            }
        };
        /**
         * @method adj
         * @return {Euclidean3}
         * @chainable
         * @beta
         */
        Euclidean3.prototype.adj = function () {
            // TODO
            return this;
        };
        /**
         * @method angle
         * @return {Euclidean3}
         */
        Euclidean3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * Computes the <e>Clifford conjugate</em> of this multivector.
         * The grade multiplier is -1<sup>x(x+1)/2</sup>
         * @method conj
         * @return {Euclidean3}
         * @chainable
         */
        Euclidean3.prototype.conj = function () {
            return new Euclidean3(this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.xyz, this.uom);
        };
        /**
         * @method cubicBezier
         * @param t {number}
         * @param controlBegin {GeometricE3}
         * @param controlEnd {GeometricE3}
         * @param endPoint {GeometricE3}
         * @return {Euclidean3}
         * @chainable
         */
        Euclidean3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = b3(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method direction
         * @return {Euclidean3}
         */
        Euclidean3.prototype.direction = function () {
            return this.div(this.norm());
        };
        /**
         * @method sub
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(-rhs);
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.sub(this);
            }
            else if (typeof lhs === 'number') {
                return this.neg().addScalar(lhs);
            }
        };
        /**
         * @method mul
         * @param rhs {Euclidean3}
         */
        Euclidean3.prototype.mul = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            mulG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        /**
         * @method scale
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.scale = function (α) {
            return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
        };
        /**
         * @method div
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.div = function (rhs) {
            assertArgEuclidean3('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
        };
        /**
         * @method divByScalar
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.divByScalar = function (α) {
            return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__div__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        /**
         * @method dual
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.dual = function () {
            // FIXME: TODO
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method scp
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.scp = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            scpG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method ext
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.ext = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            extG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        /**
         * @method lco
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.lco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            lcoG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __lshift__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rlshift__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        /**
         * @method rco
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            rcoG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rrshift__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        /**
         * @method pow
         * @param exponent {Euclidean3}
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.pow = function (exponent) {
            // assertArgEuclidean3('exponent', exponent);
            throw new Error('pow');
        };
        /**
         * @method __bang__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__bang__ = function () {
            return this.inv();
        };
        /**
         * Unary plus(+).
         * @method __pos__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method neg
         * @return {Euclidean3} <code>-1 * this</code>
         */
        Euclidean3.prototype.neg = function () {
            return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * Unary minus (-).
         * @method __neg__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @method rev
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rev = function () {
            return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * ~ (tilde) produces reversion.
         * @method __tilde__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__tilde__ = function () {
            return this.rev();
        };
        /**
         * @method grade
         * @param grade {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
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
        /**
         * Intentionally undocumented
         */
        /*
        dot(vector: Euclidean3): number {
          return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        }
        */
        /**
         * @method cross
         * @param vector {Euclidean3}
         * @return {Euclidean3}
         */
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
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        Euclidean3.prototype.isOne = function () {
            return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        Euclidean3.prototype.isZero = function () {
            return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        /*
        length() {
          return sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
        }
        */
        /**
         * @method lerp
         * @param target {Euclidean3}
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.lerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        /**
         * @method cos
         * @return {Euclidean3}
         */
        Euclidean3.prototype.cos = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var cosW = cos(this.w);
            return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        /**
         * @method cosh
         * @return {Euclidean3}
         */
        Euclidean3.prototype.cosh = function () {
            //Unit.assertDimensionless(this.uom);
            throw new NotImplementedError('cosh(Euclidean3)');
        };
        /**
         * @method distanceTo
         * @param point {Euclidean3}
         * @return {number}
         */
        Euclidean3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return sqrt(dx * dx + dy * dy + dz * dz);
        };
        /**
         * @method equals
         * @param other {Euclidean3}
         * @return {boolean}
         */
        Euclidean3.prototype.equals = function (other) {
            throw new Error("TODO: Euclidean3.equals");
        };
        /**
         * @method exp
         * @return {Euclidean3}
         */
        Euclidean3.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
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
        /**
         * Computes the <em>inverse</em> of this multivector, if it exists.
         * inv(A) = ~A / (A * ~A)
         * @method inv
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.inv = function () {
            // FIXME: This is not the definition above.
            return this.rev().divByScalar(this.squaredNorm());
        };
        /**
         * @method log
         * @return {Euclidean3}
         */
        Euclidean3.prototype.log = function () {
            // FIXME: TODO
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        Euclidean3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
         * @method norm
         * @return {Euclidean3}
         */
        Euclidean3.prototype.norm = function () {
            return new Euclidean3(this.magnitude(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
         * @method quad
         * @return {Euclidean3}
         */
        Euclidean3.prototype.quad = function () {
            return new Euclidean3(this.squaredNorm(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        /**
         * @method quadraticBezier
         * @param t {number}
         * @param controlPoint {GeometricE3}
         * @param endPoint {GeometricE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            var z = b2(t, this.z, controlPoint.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method squaredNorm
         * @return {number}
         */
        Euclidean3.prototype.squaredNorm = function () {
            return squaredNormG3(this);
        };
        /**
         * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
         * @method reflect
         * @param n {VectorE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.reflect = function (n) {
            // TODO: Optimize to minimize object creation and increase performance.
            var m = Euclidean3.fromVectorE3(n);
            return m.mul(this).mul(m).scale(-1);
        };
        /**
         * @method rotate
         * @param s {SpinorE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rotate = function (s) {
            // TODO
            return this;
        };
        /**
         * @method sin
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sin = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var sinW = sin(this.w);
            return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        /**
         * @method sinh
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sinh = function () {
            //Unit.assertDimensionless(this.uom);
            throw new Error('sinh');
        };
        /**
         * @method slerp
         * @param target {Euclidean3}
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.slerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        /**
         * @method sqrt
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sqrt = function () {
            return new Euclidean3(sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
        };
        /**
         * @method tan
         * @return {Euclidean3}
         */
        Euclidean3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        /**
         * Intentionally undocumented.
         */
        Euclidean3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coords, coordToString, labels);
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
        /**
         * @method toExponential
         * @return {string}
         */
        Euclidean3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * @method toFixed
         * @param [digits] {number}
         * @return {string}
         */
        Euclidean3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * @method toString
         * @return {string}
         */
        Euclidean3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * Provides access to the internals of Euclidean3 in order to use `product` functions.
         */
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
        /**
         * @method copy
         * @param m {GeometricE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.copy = function (m) {
            if (m instanceof Euclidean3) {
                return m;
            }
            else {
                return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0);
            }
        };
        /**
         * @method fromSpinorE3
         * @param spinor {SpinorE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.fromSpinorE3 = function (spinor) {
            if (isDefined(spinor)) {
                return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method fromVectorE3
         * @param vector {VectorE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.fromVectorE3 = function (vector) {
            if (isDefined(vector)) {
                return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        /**
         * @property BASIS_LABELS
         * @type {string[][]}
         */
        Euclidean3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD;
        /**
         * @property zero
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);
        /**
         * @property one
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);
        /**
         * @property e1
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        /**
         * @property e2
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        /**
         * @property e3
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        /**
         * @property kilogram
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);
        /**
         * @property meter
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);
        /**
         * @property second
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);
        /**
         * @property coulomb
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);
        /**
         * @property ampere
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);
        /**
         * @property kelvin
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);
        /**
         * @property mole
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);
        /**
         * @property candela
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);
        return Euclidean3;
    })();
    return Euclidean3;
});
