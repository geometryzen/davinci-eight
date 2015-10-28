import addE3 = require('../math/addE3')
import Dimensions = require('../math/Dimensions')
import Euclidean3Error = require('../math/Euclidean3Error')
import extG3 = require('../math/extG3')
import GeometricE3 = require('../math/GeometricE3')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import lcoG3 = require('../math/lcoG3')
import GeometricOperators = require('../math/GeometricOperators')
import mathcore = require('../math/mathcore');
import Measure = require('../math/Measure');
import mulE3 = require('../math/mulE3')
import mulG3 = require('../math/mulG3')
import mustBeNumber = require('../checks/mustBeNumber')
import GeometricElement = require('../math/GeometricElement')
import NotImplementedError = require('../math/NotImplementedError');
import rcoG3 = require('../math/rcoG3')
import scpG3 = require('../math/scpG3')
import SpinorE3 = require('../math/SpinorE3')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import subE3 = require('../math/subE3')
import TrigMethods = require('../math/TrigMethods')
import Unit = require('../math/Unit');
import VectorE3 = require('../math/VectorE3')

var cos = Math.cos;
var cosh = mathcore.Math.cosh;
var exp = Math.exp;
var sin = Math.sin;
var sinh = mathcore.Math.sinh;

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x;
    }
    else {
        throw new Euclidean3Error("Argument '" + name + "' must be a number");
    }
}

function assertArgEuclidean3(name: string, arg: Euclidean3): Euclidean3 {
    if (arg instanceof Euclidean3) {
        return arg;
    }
    else {
        throw new Euclidean3Error("Argument '" + arg + "' must be a Euclidean3");
    }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
    if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom;
    }
    else {
        throw new Euclidean3Error("Argument '" + uom + "' must be a Unit or undefined");
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

var divide = function(
    a000: number,
    a001: number,
    a010: number,
    a011: number,
    a100: number,
    a101: number,
    a110: number,
    a111: number,
    b000: number,
    b001: number,
    b010: number,
    b011: number,
    b100: number,
    b101: number,
    b110: number,
    b111: number,
    uom: Unit,
    dst?: Euclidean3) {
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
    var xyz: number;
    var y: number;
    var yz: number;
    var z: number;
    var zx: number;

    r000 = +b000;
    r001 = +b001;
    r010 = +b010;
    r011 = -b011;
    r100 = +b100;
    r101 = -b101;
    r110 = -b110;
    r111 = -b111;
    m000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
    m001 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
    m010 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
    m011 = 0;
    m100 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
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
    s000 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
    s001 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
    s010 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
    s011 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
    s100 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
    s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
    s110 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
    s111 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
    k000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
    i000 = s000 / k000;
    i001 = s001 / k000;
    i010 = s010 / k000;
    i011 = s011 / k000;
    i100 = s100 / k000;
    i101 = s101 / k000;
    i110 = s110 / k000;
    i111 = s111 / k000;
    x000 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
    x001 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
    x010 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
    x011 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
    x100 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
    x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
    x110 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
    x111 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
    w = x000;
    x = x001;
    y = x010;
    z = x100;
    xy = x011;
    yz = x110;
    zx = -x101;
    xyz = x111;
    if (typeof dst !== 'undefined') {
        dst.w = w;
        dst.x = x;
        dst.y = y;
        dst.z = z;
        dst.xy = xy;
        dst.yz = yz;
        dst.zx = zx;
        dst.xyz = xyz;
        dst.uom = uom;
    }
    else {
        return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
    }
};

/**
 * @class Euclidean3
 * @extends GeometricE3
 */
class Euclidean3 implements Measure<Euclidean3>, GeometricE3, GeometricElement<Euclidean3, Euclidean3, SpinorE3, VectorE3>, GeometricOperators<Euclidean3>, TrigMethods<Euclidean3> {
    public static zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);
    public static one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);
    public static e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
    public static e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
    public static e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
    public static kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);
    public static meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);
    public static second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);
    public static coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);
    public static ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);
    public static kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);
    public static mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);
    public static candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);
    /**
     * The `w` property is the grade zero (scalar) part of the Euclidean3 multivector.
     * @property w
     * @type number
     */
    public w: number;
    /**
     * The `x` property is the x coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    public x: number;
    /**
     * The `y` property is the y coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    public y: number;
    /**
     * The `z` property is the z coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    public z: number;
    /**
     * The `xy` property is the xy coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    public xy: number;
    /**
     * The `yz` property is the yz coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    public yz: number;
    /**
     * The `zx` property is the zx coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    public zx: number;
    /**
     * The `xyz` property is the grade three (pseudoscalar) part of the Euclidean3 multivector.
     */
    public xyz: number;
    /**
     * The optional unit of measure.
     */
    public uom: Unit;
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
     * Constructs a Euclidean3 from its coordinates.
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} z The vector component of the multivector in the z-direction.
     * @param {number} xy The bivector component of the multivector in the xy-plane.
     * @param {number} yz The bivector component of the multivector in the yz-plane.
     * @param {number} zx The bivector component of the multivector in the zx-plane.
     * @param {number} xyz The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom?: Unit) {
        this.w = assertArgNumber('w', w);
        this.x = assertArgNumber('x', x);
        this.y = assertArgNumber('y', y);
        this.z = assertArgNumber('z', z);
        this.xy = assertArgNumber('xy', xy);
        this.yz = assertArgNumber('yz', yz);
        this.zx = assertArgNumber('zx', zx);
        this.xyz = assertArgNumber('xyz', xyz);
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

    static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3 {
        assertArgNumber('w', w);
        assertArgNumber('x', x);
        assertArgNumber('y', y);
        assertArgNumber('z', z);
        assertArgNumber('xy', xy);
        assertArgNumber('yz', yz);
        assertArgNumber('zx', zx);
        assertArgNumber('xyz', xyz);
        assertArgUnitOrUndefined('uom', uom);
        return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
    }

    /**
     * @method fromSpinorE3
     * @param spinor {SpinorE3}
     * @return {Euclidean3}
     */
    static fromSpinorE3(spinor: SpinorE3): Euclidean3 {
        if (isDefined(spinor)) {
            return new Euclidean3(spinor.w, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
        }
        else {
            return void 0
        }
    }

    coordinates(): number[] {
        return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
    }

    coordinate(index: number): number {
        assertArgNumber('index', index);
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
                throw new Euclidean3Error("index must be in the range [0..7]");
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
        return compute(addE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
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

    __add__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.add(other);
        }
        else if (typeof other === 'number') {
            return this.add(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __radd__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).add(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).add(this);
        }
    }

    adj(): Euclidean3 {
        // TODO
        return this;
    }

    /**
     * @method arg
     * @return {number}
     */
    arg(): number {
        throw new Error('TODO: Euclidean3.arg')
    }

    /**
     * @method conj
     * @return {Euclidean3}
     */
    conj(): Euclidean3 {
        // FIXME; What kind of conjugation?
        return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
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
        return compute(subE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
    }

    __sub__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.sub(other);
        }
        else if (typeof other === 'number') {
            return this.sub(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rsub__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).sub(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).sub(this);
        }
    }

    mul(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        return mulG3(this, rhs, out)
    }

    __mul__(other: any): any {
        if (other instanceof Euclidean3) {
            return this.mul(other);
        }
        else if (typeof other === 'number') {
            return this.mul(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rmul__(other: any): any {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).mul(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).mul(this);
        }
    }

    scale(α: number): Euclidean3 {
        return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
    }

    div(rhs: Euclidean3): Euclidean3 {
        assertArgEuclidean3('rhs', rhs);
        return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
    }

    divByScalar(α: number): Euclidean3 {
        return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
    }

    __div__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.div(other);
        }
        else if (typeof other === 'number') {
            // FIXME divByScalar would be good?
            return this.div(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rdiv__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).div(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
        }
    }

    dual(): Euclidean3 {
        // FIXME: TODO
        return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom)
    }

    scp(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        return scpG3(this, rhs, out)
    }

    ext(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        return extG3(this, rhs, out)
    }

    __vbar__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.scp(other);
        }
        else if (typeof other === 'number') {
            return this.scp(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rvbar__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).scp(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
        }
    }

    __wedge__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.ext(other);
        }
        else if (typeof other === 'number') {
            return this.ext(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rwedge__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).ext(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).ext(this);
        }
    }

    lco(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        return lcoG3(this, rhs, out)
    }

    __lshift__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.lco(other);
        }
        else if (typeof other === 'number') {
            return this.lco(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rlshift__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).lco(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
        }
    }

    rco(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        var w = out.w
        return rcoG3(this, rhs, out)
    }

    __rshift__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return this.rco(other);
        }
        else if (typeof other === 'number') {
            return this.rco(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    __rrshift__(other: any): Euclidean3 {
        if (other instanceof Euclidean3) {
            return (<Euclidean3>other).rco(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
        }
    }

    pow(exponent: Euclidean3): Euclidean3 {
        // assertArgEuclidean3('exponent', exponent);
        throw new Euclidean3Error('pow');
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
     * @method reverse
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

    grade(index: number): Euclidean3 {
        assertArgNumber('index', index);
        switch (index) {
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

    // FIXME: This should return a Euclidean3
    dot(vector: Euclidean3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

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
    isOne(): boolean {
        return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
    }
    isZero(): boolean {
        return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
    }
    length() {
        return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
    }

    lerp(target: Euclidean3, α: number): Euclidean3 {
        // FIXME: TODO
        return this
    }

    cos(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom);
        var cosW = cos(this.w);
        return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
    }

    cosh(): Euclidean3 {
        //Unit.assertDimensionless(this.uom);
        throw new NotImplementedError('cosh(Euclidean3)');
    }

    exp(): Euclidean3 {
        Unit.assertDimensionless(this.uom);
        var bivector = this.grade(2);
        var a = bivector.norm();
        if (!a.isZero()) {
            var c = a.cos();
            var s = a.sin();
            var B = bivector.unitary();
            return c.add(B.mul(s));
        }
        else {
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        }
    }

    inv(): Euclidean3 {
        // FIXME: TODO
        return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
    }

    log(): Euclidean3 {
        // FIXME: TODO
        return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
    }

    magnitude(): number {
        // FIXME: TODO
        return 0
    }

    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     */
    norm(): Euclidean3 { return new Euclidean3(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz), 0, 0, 0, 0, 0, 0, 0, this.uom); }

    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     */
    quad(): Euclidean3 {
        return new Euclidean3(this.quaditude(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    quaditude(): number {
        // FIXME: The shortcoming of this method is that it drops the units.
        return this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz
    }
    reflect(n: VectorE3): Euclidean3 {
        // TODO
        return this
    }
    rotate(s: SpinorE3): Euclidean3 {
        // TODO
        return this
    }
    sin(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom);
        var sinW = sin(this.w);
        return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
    }

    sinh(): Euclidean3 {
        //Unit.assertDimensionless(this.uom);
        throw new Euclidean3Error('sinh');
    }

    slerp(target: Euclidean3, α: number): Euclidean3 {
        // FIXME: TODO
        return this
    }

    unitary(): Euclidean3 {
        return this.div(this.norm());
    }
    /**
     * @method gradeZero
     * @return {number}
     */
    gradeZero(): number {
        return this.w;
    }

    sqrt() {
        return new Euclidean3(Math.sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
    }

    toStringCustom(
        coordToString: (x: number) => string,
        labels: string[]): string {
        var quantityString: string = stringFromCoordinates(this.coordinates(), coordToString, labels);
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

    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
    }

    toFixed(digits?: number): string {
        assertArgNumber('digits', digits);
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
    }

    toString(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
    }

    toStringIJK(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "i", "j", "k", "ij", "jk", "ki", "I"]);
    }

    toStringLATEX(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{3}", "e_{12}", "e_{23}", "e_{31}", "e_{123}"]);
    }
}

export = Euclidean3;