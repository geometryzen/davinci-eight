import addE3 = require('../math/addE3')
import b2 = require('../geometries/b2')
import b3 = require('../geometries/b3')
import Dimensions = require('../math/Dimensions')
import extG3 = require('../math/extG3')
import GeometricE3 = require('../math/GeometricE3')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import lcoG3 = require('../math/lcoG3')
import GeometricOperators = require('../math/GeometricOperators')
import mathcore = require('../math/mathcore');
import ImmutableMeasure = require('../math/ImmutableMeasure');
import mulE3 = require('../math/mulE3')
import mulG3 = require('../math/mulG3')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import GeometricElement = require('../math/GeometricElement')
import NotImplementedError = require('../math/NotImplementedError');
import rcoG3 = require('../math/rcoG3')
import readOnly = require('../i18n/readOnly')
import scpG3 = require('../math/scpG3')
import SpinorE3 = require('../math/SpinorE3')
import squaredNormG3 = require('../math/squaredNormG3')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import subE3 = require('../math/subE3')
import TrigMethods = require('../math/TrigMethods')
import Unit = require('../math/Unit');
import VectorE3 = require('../math/VectorE3')
import BASIS_LABELS_G3_GEOMETRIC = require('../math/BASIS_LABELS_G3_GEOMETRIC')
import BASIS_LABELS_G3_HAMILTON = require('../math/BASIS_LABELS_G3_HAMILTON')
import BASIS_LABELS_G3_STANDARD = require('../math/BASIS_LABELS_G3_STANDARD')
import BASIS_LABELS_G3_STANDARD_HTML = require('../math/BASIS_LABELS_G3_STANDARD_HTML')

let cos = Math.cos;
let cosh = mathcore.Math.cosh;
let exp = Math.exp;
let sin = Math.sin;
let sinh = mathcore.Math.sinh;
let sqrt = Math.sqrt;

function assertArgEuclidean3(name: string, arg: Euclidean3): Euclidean3 {
    if (arg instanceof Euclidean3) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a Euclidean3");
    }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
    if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom;
    }
    else {
        throw new Error("Argument '" + uom + "' must be a Unit or undefined");
    }
}

function compute(
    f: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, y0: number, y1: number, y2: number, y3: number, y4: number, y5: number, y6: number, y7: number, index: number) => number,
    a: number[],
    b: number[],
    coord: (m: number[], index: number) => number,
    pack: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, uom: Unit) => Euclidean3,
    uom: Unit): Euclidean3 {
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
var divide = function(
    a000: number,  // a.w
    a001: number,  // a.x
    a010: number,  // a.y
    a011: number,  // a.xy
    a100: number,  // a.z
    a101: number,  // -a.zx or a.xz
    a110: number,  // a.yz
    a111: number,  // a.xyz
    b000: number,  // b.w
    b001: number,  // b.x
    b010: number,  // b.y
    b011: number,  // b.xy
    b100: number,  // b.z
    b101: number,  // -b.zx or b.xz
    b110: number,  // b.yz
    b111: number,  // b.xyz
    uom: Unit) {
    var c000: number;
    var c001: number;
    var c010: number;
    var c011: number;
    var c100: number;
    var c101: number;
    var c110: number;
    var c111: number;
    var i000: number;
    var i001: number;
    var i010: number;
    var i011: number;
    var i100: number;
    var i101: number;
    var i110: number;
    var i111: number;
    var k000: number;
    var m000: number;
    var m001: number;
    var m010: number;
    var m011: number;
    var m100: number;
    var m101: number;
    var m110: number;
    var m111: number;
    var r000: number;
    var r001: number;
    var r010: number;
    var r011: number;
    var r100: number;
    var r101: number;
    var r110: number;
    var r111: number;
    var s000: number;
    var s001: number;
    var s010: number;
    var s011: number;
    var s100: number;
    var s101: number;
    var s110: number;
    var s111: number;
    var w: number;
    var x: number;
    var x000: number;
    var x001: number;
    var x010: number;
    var x011: number;
    var x100: number;
    var x101: number;
    var x110: number;
    var x111: number;
    var xy: number;
    var β: number;
    var y: number;
    var yz: number;
    var z: number;
    var zx: number;

    // This looks like the reversion of b, but there is a strange sign flip for zx
    // r = ~b
    r000 = +b000;  // => b.w
    r001 = +b001;  // => b.x
    r010 = +b010;  // => b.y
    r011 = -b011;  // => -b.xy
    r100 = +b100;  // => b.z
    r101 = -b101;  // => +b.zx
    r110 = -b110;  // => -b.yz
    r111 = -b111;  // => -b.xyz

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
class Euclidean3 implements ImmutableMeasure<Euclidean3>, GeometricE3, GeometricElement<Euclidean3, Euclidean3, SpinorE3, VectorE3>, GeometricOperators<Euclidean3>, TrigMethods<Euclidean3> {
    static get BASIS_LABELS_GEOMETRIC(): string[][] { return BASIS_LABELS_G3_GEOMETRIC };
    static get BASIS_LABELS_HAMILTON(): string[][] { return BASIS_LABELS_G3_HAMILTON };
    static get BASIS_LABELS_STANDARD(): string[][] { return BASIS_LABELS_G3_STANDARD };
    static get BASIS_LABELS_STANDARD_HTML(): string[][] { return BASIS_LABELS_G3_STANDARD_HTML };

    /**
     * @property BASIS_LABELS
     * @type {string[][]}
     */
    static BASIS_LABELS: string[][] = BASIS_LABELS_G3_STANDARD

    /**
     * @property zero
     * @type {Euclidean3}
     * @static
     */
    public static zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);

    /**
     * @property one
     * @type {Euclidean3}
     * @static
     */
    public static one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);

    /**
     * @property e1
     * @type {Euclidean3}
     * @static
     */
    public static e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);

    /**
     * @property e2
     * @type {Euclidean3}
     * @static
     */
    public static e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);

    /**
     * @property e3
     * @type {Euclidean3}
     * @static
     */
    public static e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);

    /**
     * @property kilogram
     * @type {Euclidean3}
     * @static
     */
    public static kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);

    /**
     * @property meter
     * @type {Euclidean3}
     * @static
     */
    public static meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);

    /**
     * @property second
     * @type {Euclidean3}
     * @static
     */
    public static second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);

    /**
     * @property coulomb
     * @type {Euclidean3}
     * @static
     */
    public static coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);

    /**
     * @property ampere
     * @type {Euclidean3}
     * @static
     */
    public static ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);

    /**
     * @property kelvin
     * @type {Euclidean3}
     * @static
     */
    public static kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);

    /**
     * @property mole
     * @type {Euclidean3}
     * @static
     */
    public static mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);

    /**
     * @property candela
     * @type {Euclidean3}
     * @static
     */
    public static candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);

    /**
     * @property w
     * @type {number}
     * @private
     */
    private w: number;

    /**
     * The `x` property is the x coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property x
     * @type {number}
     */
    public x: number;

    /**
     * The `y` property is the y coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property y
     * @type {number}
     */
    public y: number;

    /**
     * The `z` property is the z coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property z
     * @type {number}
     */
    public z: number;

    /**
     * The `xy` property is the xy coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property xy
     * @type {number}
     */
    public xy: number;

    /**
     * The `yz` property is the yz coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property yz
     * @type {number}
     */
    public yz: number;

    /**
     * The `zx` property is the zx coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property zx
     * @type {number}
     */
    public zx: number;

    /**
     * @property xyz
     * @type {number}
     * @private
     */
    private xyz: number;

    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     */
    public uom: Unit;
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
    constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit) {
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
            var multiplier: number = this.uom.multiplier;
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

    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    get α(): number {
        return this.w
    }
    set α(unused) {
        throw new Error(readOnly('α').message)
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @return {number}
     */
    get β(): number {
        return this.xyz
    }
    set β(unused) {
        throw new Error(readOnly('β').message)
    }

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
    static fromCartesian(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom: Unit): Euclidean3 {
        mustBeNumber('α', α)
        mustBeNumber('x', x)
        mustBeNumber('y', y)
        mustBeNumber('z', z)
        mustBeNumber('xy', xy)
        mustBeNumber('yz', yz)
        mustBeNumber('zx', zx)
        mustBeNumber('β', β)
        assertArgUnitOrUndefined('uom', uom)
        return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom)
    }

    /**
     * @property coords
     * @type {number[]}
     */
    get coords(): number[] {
        return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
    }

    /**
     * @method coordinate
     * @param index {number}
     * @return {number}
     */
    coordinate(index: number): number {
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
    }

    /**
     * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
     * This method does not change this Euclidean3.
     * @method add
     * @param rhs {Euclidean3}
     * @return {Euclidean3} This Euclidean3 plus rhs.
     */
    add(rhs: Euclidean3): Euclidean3 {
        var coord = function(x: number[], n: number): number {
            return x[n];
        };
        var pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3 {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        return compute(addE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
    }

    /**
     * Computes <code>this + Iβ</code>
     * @method addPseudo
     * @param β {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Euclidean3 {
        if (isDefined(β)) {
            mustBeNumber('β', β)
            return new Euclidean3(this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz + β, this.uom)
        }
        else {
            // Consider returning an undefined sentinel?
            // This would allow chained methods to continue.
            // The first check might then be isNumber. 
            return void 0
        }
    }

    /**
     * Computes <code>this + α</code>
     * @method addScalar
     * @param α {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Euclidean3 {
        if (isDefined(α)) {
            mustBeNumber('α', α)
            return new Euclidean3(this.w + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz, this.uom)
        }
        else {
            // Consider returning an undefined sentinel?
            // This would allow chained methods to continue.
            // The first check might then be isNumber. 
            return void 0
        }
    }

    /**
     * @method __add__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __add__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.add(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.addScalar(rhs);
        }
    }

    /**
     * @method __radd__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __radd__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.add(this)
        }
        else if (typeof lhs === 'number') {
            return this.addScalar(lhs)
        }
    }

    /**
     * @method adj
     * @return {Euclidean3}
     * @chainable
     * @beta
     */
    adj(): Euclidean3 {
        // TODO
        return this;
    }

    /**
     * @method angle
     * @return {Euclidean3}
     */
    angle(): Euclidean3 {
        return this.log().grade(2);
    }

    /**
     * Computes the <e>Clifford conjugate</em> of this multivector.
     * The grade multiplier is -1<sup>x(x+1)/2</sup>
     * @method conj
     * @return {Euclidean3}
     * @chainable
     */
    conj(): Euclidean3 {
        return new Euclidean3(this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.xyz, this.uom);
    }

    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {GeometricE3}
     * @param controlEnd {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     * @chainable
     */
    cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3) {
        let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        let z = b3(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
    }

    /**
     * @method direction
     * @return {Euclidean3}
     */
    direction(): Euclidean3 {
        return this.div(this.norm());
    }

    /**
     * @method sub
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    sub(rhs: Euclidean3): Euclidean3 {
        var coord = function(x: number[], n: number): number {
            return x[n];
        };
        var pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3 {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        return compute(subE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
    }

    /**
     * @method __sub__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __sub__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.sub(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.addScalar(-rhs);
        }
    }


    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rsub__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.sub(this)
        }
        else if (typeof lhs === 'number') {
            return this.neg().addScalar(lhs)
        }
    }

    /**
     * @method mul
     * @param rhs {Euclidean3}
     */
    mul(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        mulG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __mul__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __mul__(rhs: any): any {
        if (rhs instanceof Euclidean3) {
            return this.mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.scale(rhs)
        }
    }

    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rmul__(lhs: any): any {
        if (lhs instanceof Euclidean3) {
            return lhs.mul(this)
        }
        else if (typeof lhs === 'number') {
            return this.scale(lhs)
        }
    }

    /**
     * @method scale
     * @param α {number}
     * @return {Euclidean3}
     */
    scale(α: number): Euclidean3 {
        return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
    }

    /**
     * @method div
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    div(rhs: Euclidean3): Euclidean3 {
        assertArgEuclidean3('rhs', rhs);
        return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
    }

    /**
     * @method divByScalar
     * @param α {number}
     * @return {Euclidean3}
     */
    divByScalar(α: number): Euclidean3 {
        return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
    }

    /**
     * @method __div__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __div__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.div(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.divByScalar(rhs)
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rdiv__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.div(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
        }
    }

    /**
     * @method dual
     * @return {Euclidean3}
     * @beta
     */
    dual(): Euclidean3 {
        // FIXME: TODO
        return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom)
    }

    /**
     * @method scp
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    scp(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        scpG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method ext
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    ext(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        extG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __vbar__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.scp(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rvbar__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.scp(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
        }
    }

    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __wedge__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.ext(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.scale(rhs)
        }
    }

    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rwedge__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.ext(this)
        }
        else if (typeof lhs === 'number') {
            return this.scale(lhs)
        }
    }

    /**
     * @method lco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    lco(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        lcoG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __lshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __lshift__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.lco(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rlshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rlshift__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.lco(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
        }
    }

    /**
     * @method rco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    rco(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        rcoG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rshift__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.rco(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rrshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rrshift__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.rco(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
        }
    }

    /**
     * @method pow
     * @param exponent {Euclidean3}
     * @return {Euclidean3}
     * @beta
     */
    pow(exponent: Euclidean3): Euclidean3 {
        // assertArgEuclidean3('exponent', exponent);
        throw new Error('pow');
    }

    /**
     * @method __bang__
     * @return {Euclidean3}
     * @private
     */
    __bang__(): Euclidean3 {
        return this.inv()
    }

    /**
     * Unary plus(+).
     * @method __pos__
     * @return {Euclidean3}
     * @private
     */
    __pos__(): Euclidean3 {
        return this;
    }

    /**
     * @method neg
     * @return {Euclidean3} <code>-1 * this</code>
     */
    neg(): Euclidean3 {
        return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
    }
    /**
     * Unary minus (-).
     * @method __neg__
     * @return {Euclidean3}
     * @private
     */
    __neg__(): Euclidean3 {
        return this.neg()
    }

    /**
     * @method rev
     * @return {Euclidean3}
     */
    rev(): Euclidean3 {
        return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
    }

    /**
     * ~ (tilde) produces reversion.
     * @method __tilde__
     * @return {Euclidean3}
     * @private
     */
    __tilde__(): Euclidean3 {
        return this.rev()
    }

    /**
     * @method grade
     * @param grade {number}
     * @return {Euclidean3}
     */
    grade(grade: number): Euclidean3 {
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
    }

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
    cross(vector: Euclidean3): Euclidean3 {
        var x: number;
        var x1: number;
        var x2: number;
        var y: number;
        var y1: number;
        var y2: number;
        var z: number;
        var z1: number;
        var z2: number;

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
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
    }

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
    lerp(target: Euclidean3, α: number): Euclidean3 {
        // FIXME: TODO
        return this
    }

    /**
     * @method cos
     * @return {Euclidean3}
     */
    cos(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom);
        var cosW = cos(this.w);
        return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
    }

    /**
     * @method cosh
     * @return {Euclidean3}
     */
    cosh(): Euclidean3 {
        //Unit.assertDimensionless(this.uom);
        throw new NotImplementedError('cosh(Euclidean3)');
    }

    /**
     * @method distanceTo
     * @param point {Euclidean3}
     * @return {number}
     */
    distanceTo(point: Euclidean3): number {
        let dx = this.x - point.x
        let dy = this.y - point.y
        let dz = this.z - point.z
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    /**
     * @method equals
     * @param other {Euclidean3}
     * @return {boolean}
     */
    equals(other: Euclidean3): boolean {
        throw new Error("TODO: Euclidean3.equals")
    }

    /**
     * @method exp
     * @return {Euclidean3}
     */
    exp(): Euclidean3 {
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
    }

    /**
     * Computes the <em>inverse</em> of this multivector, if it exists.
     * inv(A) = ~A / (A * ~A)
     * @method inv
     * @return {Euclidean3}
     * @beta
     */
    inv(): Euclidean3 {
        // FIXME: This is not the definition above.
        return this.rev().divByScalar(this.squaredNorm())
    }

    /**
     * @method log
     * @return {Euclidean3}
     */
    log(): Euclidean3 {
        // FIXME: TODO
        return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm())
    }

    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     * @method norm
     * @return {Euclidean3}
     */
    norm(): Euclidean3 {
        return new Euclidean3(this.magnitude(), 0, 0, 0, 0, 0, 0, 0, this.uom)
    }

    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     * @method quad
     * @return {Euclidean3}
     */
    quad(): Euclidean3 {
        return new Euclidean3(this.squaredNorm(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     */
    quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3) {
        let x = b2(t, this.x, controlPoint.x, endPoint.x);
        let y = b2(t, this.y, controlPoint.y, endPoint.y);
        let z = b2(t, this.z, controlPoint.z, endPoint.z);
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
    }

    /**
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number {
        return squaredNormG3(this)
    }

    /**
     * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
     * @method reflect
     * @param n {VectorE3}
     * @return {Euclidean3}
     */
    reflect(n: VectorE3): Euclidean3 {
        // TODO: Optimize to minimize object creation and increase performance.
        let m = Euclidean3.fromVectorE3(n)
        return m.mul(this).mul(m).scale(-1)
    }

    /**
     * @method rotate
     * @param s {SpinorE3}
     * @return {Euclidean3}
     */
    rotate(s: SpinorE3): Euclidean3 {
        // TODO
        return this
    }

    /**
     * @method sin
     * @return {Euclidean3}
     */
    sin(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom);
        var sinW = sin(this.w);
        return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
    }

    /**
     * @method sinh
     * @return {Euclidean3}
     */
    sinh(): Euclidean3 {
        //Unit.assertDimensionless(this.uom);
        throw new Error('sinh');
    }

    /**
     * @method slerp
     * @param target {Euclidean3}
     * @param α {number}
     * @return {Euclidean3}
     */
    slerp(target: Euclidean3, α: number): Euclidean3 {
        // FIXME: TODO
        return this
    }

    /**
     * @method sqrt
     * @return {Euclidean3}
     */
    sqrt() {
        return new Euclidean3(sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
    }

    /**
     * @method tan
     * @return {Euclidean3}
     */
    tan(): Euclidean3 {
        return this.sin().div(this.cos())
    }

    /**
     * Intentionally undocumented.
     */
    toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string {
        var quantityString: string = stringFromCoordinates(this.coords, coordToString, labels);
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
    }

    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        let coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * Provides access to the internals of Euclidean3 in order to use `product` functions.
     */
    private static mutator(M: Euclidean3): GeometricE3 {
        var that: GeometricE3 = {
            set α(α: number) {
                M.w = α
            },
            set x(x: number) {
                M.x = x
            },
            set y(y: number) {
                M.y = y
            },
            set z(z: number) {
                M.z = z
            },
            set yz(yz: number) {
                M.yz = yz
            },
            set zx(zx: number) {
                M.zx = zx
            },
            set xy(xy: number) {
                M.xy = xy
            },
            set β(β: number) {
                M.xyz = β
            },
            //            magnitude(): number {
            //                throw new Error("magnitude() should not be needed.");
            //            },
            //            squaredNorm(): number {
            //                throw new Error("squaredNorm() should not be needed.");
            //            }
        }
        return that
    }

    /**
     * @method copy
     * @param m {GeometricE3}
     * @return {Euclidean3}
     * @static
     */
    static copy(m: GeometricE3): Euclidean3 {
        if (m instanceof Euclidean3) {
            return m
        }
        else {
            return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0)
        }
    }

    /**
     * @method fromSpinorE3
     * @param spinor {SpinorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromSpinorE3(spinor: SpinorE3): Euclidean3 {
        if (isDefined(spinor)) {
            return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0)
        }
        else {
            return void 0
        }
    }

    /**
     * @method fromVectorE3
     * @param vector {VectorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromVectorE3(vector: VectorE3): Euclidean3 {
        if (isDefined(vector)) {
            return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0)
        }
        else {
            return void 0
        }
    }
}

export = Euclidean3;