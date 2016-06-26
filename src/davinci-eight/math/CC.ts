import GeometricOperators from '../math/GeometricOperators';
import mathcore from '../math/mathcore';
import Measure from '../math/Measure';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import readOnly from '../i18n/readOnly';
import SpinorE2 from '../math/SpinorE2';
import TrigMethods from '../math/TrigMethods';
import {Unit} from '../math/Unit';

/**
 * @module EIGHT
 * @submodule math
 */

const atan2 = Math.atan2
const cos = Math.cos
const cosh = mathcore.Math.cosh
const exp = Math.exp
const log = Math.log
const sin = Math.sin
const sinh = mathcore.Math.sinh
const sqrt = Math.sqrt

function mul(a: CC, b: CC): CC {
    const x = a.a * b.a - a.b * b.b
    const y = a.a * b.b + a.b * b.a
    return new CC(x, y, Unit.mul(a.uom, b.uom))
}

function divide(a: CC, b: CC): CC {
    const q = b.a * b.a + b.b * b.b
    const x = (a.a * b.a + a.b * b.b) / q
    const y = (a.b * b.a - a.a * b.b) / q
    return new CC(x, y, Unit.div(a.uom, b.uom))
}

function norm(x: number, y: number): number {
    return sqrt(x * x + y * y)
}

/**
 * @class CC
 */
// FIXME: Either remove Unit or make GeometricOperators parameters consistent.
export default class CC implements Measure<CC>, GeometricOperators<CC, number>, TrigMethods<CC>, SpinorE2 {
    /**
     * The <em>real</em> part of the complex number.
     * @property x
     * @type {number}
     * @private
     */
    public x: number;
    /**
     * The <em>imaginary</em> part of the complex number.
     * @property y
     * @type {number}
     * @private
     */
    public y: number;
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     */
    public uom: Unit;
    /**
     * @class CC
     * @constructor
     * CConstructs a complex number z = (x, y).
     * @param α The <em>scalar</em> or <em>real</em> part of the complex number.
     * @param β The <em>pseudoscalar</em> or <em>imaginary</em> part of the complex number.
     */
    constructor(α: number, β: number, uom?: Unit) {
        this.x = mustBeNumber('α', α)
        this.y = mustBeNumber('β', β)
        this.uom = uom
        if (this.uom && this.uom.multiplier !== 1) {
            var multiplier: number = this.uom.multiplier
            this.x *= multiplier
            this.y *= multiplier
            this.uom = new Unit(1, uom.dimensions, uom.labels)
        }
    }

    /**
     * The <em>real</em> or <em>scalar</em> part of this complex number.
     */
    get a(): number {
        return this.x;
    }
    set a(unused) {
        throw new Error(readOnly('a').message)
    }

    /**
     * The <em>imaginary</em> or <em>pseudoscalar</em> part of this complex number.
     */
    get b(): number {
        return this.y;
    }
    set b(unused) {
        throw new Error(readOnly('b').message)
    }
    get xy(): number {
        return this.y;
    }
    set xy(unused) {
        throw new Error(readOnly('xy').message)
    }

    /**
     * @property coords
     * @type {number[]}
     * @readOnly
     */
    get coords(): number[] {
        return [this.x, this.y]
    }

    /**
     * @method add
     * @param rhs {CC}
     * @return {CC}
     */
    add(rhs: CC): CC {
        return new CC(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom))
    }

    /**
     * complex.angle() => complex.log().grade(2)
     * @method angle
     * @return {CC}
     */
    angle(): CC {
        // Optimized by only computing grade 2.
        return new CC(0, atan2(this.b, this.a))
    }

    /**
     * @method __add__
     * @param other {number | CC}
     * @return {CC}
     * @private
     */
    __add__(other: number | CC): CC {
        if (other instanceof CC) {
            return this.add(other)
        }
        else if (typeof other === 'number') {
            return new CC(this.x + other, this.y, Unit.compatible(this.uom, undefined))
        }
        else {
            return void 0
        }
    }
    /**
     * __radd__ supports operator +(any, CC)
     */
    __radd__(other: any): CC {
        if (other instanceof CC) {
            var lhs: CC = other;
            return new CC(other.x + this.x, other.y + this.y, Unit.compatible(lhs.uom, this.uom));
        }
        else if (typeof other === 'number') {
            var x: number = other;
            return new CC(x + this.x, this.y, Unit.compatible(undefined, this.uom));
        }
    }

    /**
     * @method sub
     * @param rhs {CC}
     * @return {CC}
     */
    sub(rhs: CC): CC {
        return new CC(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
    }
    __sub__(other: any): CC {
        if (other instanceof CC) {
            var rhs: CC = other;
            return new CC(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
        }
        else if (typeof other === 'number') {
            var x: number = other;
            return new CC(this.x - x, this.y, Unit.compatible(this.uom, undefined));
        }
    }
    __rsub__(other: any): CC {
        if (other instanceof CC) {
            var lhs: CC = other;
            return new CC(lhs.x - this.x, lhs.y - this.y, Unit.compatible(lhs.uom, this.uom));
        }
        else if (typeof other === 'number') {
            var x: number = other;
            return new CC(x - this.x, -this.y, Unit.compatible(undefined, this.uom));
        }
    }
    /**
     * @method mul
     * @param rhs {CC}
     * @return {CC}
     */
    mul(rhs: CC): CC {
        return mul(this, rhs);
    }

    __mul__(other: any): CC {
        if (other instanceof CC) {
            return mul(this, other);
        }
        else if (typeof other === 'number') {
            var x: number = other;
            return new CC(this.x * x, this.y * x, this.uom);
        }
    }

    __rmul__(other: any): CC {
        if (other instanceof CC) {
            return mul(other, this);
        }
        else if (typeof other === 'number') {
            var x: number = other;
            return new CC(x * this.x, x * this.y, this.uom);
        }
    }

    /**
     * @method div
     * @param rhs {CC}
     * @return {CC}
     */
    div(rhs: CC): CC {
        return divide(this, rhs);
    }

    /**
     * @method divByScalar
     * @param α {number}
     * @return {CC}
     */
    divByScalar(α: number): CC {
        return new CC(this.x / α, this.y / α, this.uom)
    }

    __div__(other: any): CC {
        if (other instanceof CC) {
            return divide(this, other);
        }
        else if (typeof other === 'number') {
            return new CC(this.x / other, this.y / other, this.uom);
        }
    }

    __rdiv__(other: any): CC {
        if (other instanceof CC) {
            return divide(other, this);
        }
        else if (typeof other === 'number') {
            return divide(new CC(other, 0), this);
        }
    }
    /**
     * @method align
     * @param rhs {CC}
     * @return {CC}
     */
    scp(rhs: CC): CC {
        return new CC(this.x * rhs.x - this.y * rhs.y, 0, Unit.mul(this.uom, this.uom))
    }

    __vbar__(other: any): CC {
        throw new Error("")
    }

    __rvbar__(other: any): CC {
        throw new Error("")
    }
    /**
     * @method wedge
     * @param rhs {CC}
     * @return {CC}
     */
    ext(rhs: CC): CC {
        throw new Error('wedge');
    }

    __wedge__(other: any): CC {
        throw new Error("")
    }

    __rwedge__(other: any): CC {
        throw new Error("")
    }

    grade(grade: number): CC {
        mustBeInteger('grade', grade)
        switch (grade) {
            case 0: return new CC(this.x, 0, this.uom)
            case 2: return new CC(0, this.y, this.uom)
            default: return new CC(0, 0, this.uom)
        }
    }

    /**
     * @method lco
     * @param rhs {CC}
     * @return {CC}
     */
    lco(rhs: CC): CC {
        throw new Error('lco');
    }

    lerp(target: CC, α: number): CC {
        return this
    }

    log(): CC {
        // TODO: Is dimesionless really necessary?
        Unit.assertDimensionless(this.uom)
        let α = this.a
        let β = this.b
        return new CC(log(sqrt(α * α + β * β)), atan2(β, α))
    }

    /**
     * @method rco
     * @param rhs {CC}
     * @return {CC}
     */
    rco(rhs: CC): CC {
        throw new Error('rco');
    }

    /**
     * @method pow
     * @param exponent {CC}
     * @return {CC}
     */
    pow(exponent: CC): CC {
        throw new Error('pow');
    }

    /**
     * @method cos
     * @return {CC}
     */
    cos(): CC {
        Unit.assertDimensionless(this.uom);
        var x = this.x;
        var y = this.y;
        return new CC(cos(x) * cosh(y), - sin(x) * sinh(y));
    }

    /**
     * @method cosh
     * @return {CC}
     */
    cosh(): CC {
        Unit.assertDimensionless(this.uom);
        var x = this.x;
        var y = this.y;
        return new CC(cosh(x) * cos(y), sinh(x) * sin(y));
    }

    /**
     * @method exp
     * @return {CC}
     */
    exp(): CC {
        Unit.assertDimensionless(this.uom);
        var x = this.x;
        var y = this.y;
        var expX = exp(x);
        return new CC(expX * cos(y), expX * sin(y));
    }

    /**
     * Computes the multiplicative inverse of this complex number.
     * @method inv
     * @return {CC}
     */
    inv(): CC {
        let x = this.x
        let y = this.y
        let d = x * x + y * y
        return new CC(this.x / d, -this.y / d, this.uom ? this.uom.inv() : void 0)
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.x === 1 && this.y === 0
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.x === 0 && this.y === 0
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    /**
     * Computes the additive inverse of this complex number.
     * @method neg
     * @return {CC}
     */
    neg(): CC {
        return new CC(-this.x, -this.y, this.uom)
    }

    /**
     * @method norm
     * @return {CC}
     */
    norm(): CC {
        return new CC(this.magnitude(), 0, this.uom);
    }

    /**
     * @method quad
     * @return {CC}
     */
    quad(): CC {
        return new CC(this.squaredNorm(), 0, Unit.mul(this.uom, this.uom));
    }

    /**
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number {
        var x = this.x
        var y = this.y
        return x * x + y * y
    }

    /**
     * @method scale
     * @param α {number}
     * @return {CC}
     */
    scale(α: number): CC {
        return new CC(α * this.x, α * this.y, this.uom)
    }

    /**
     * @method sin
     * @return {CC}
     */
    sin(): CC {
        Unit.assertDimensionless(this.uom);
        var x = this.x;
        var y = this.y;
        return new CC(sin(x) * cosh(y), cos(x) * sinh(y));
    }

    /**
     * @method sinh
     * @return {CC}
     */
    sinh(): CC {
        Unit.assertDimensionless(this.uom);
        var x = this.x;
        var y = this.y;
        return new CC(sinh(x) * cos(y), cosh(x) * sin(y));
    }

    slerp(target: CC, α: number): CC {
        return this
    }

    /**
     * @method direction
     * @return {CC}
     */
    direction(): CC {
        var x = this.x;
        var y = this.y;
        var divisor = norm(x, y);
        return new CC(x / divisor, y / divisor);
    }

    /**
     * @method tan
     * @return {CC}
     */
    tan(): CC {
        return this.sin().div(this.cos())
    }

    toStringCustom(coordToString: (x: number) => string): string {
        var quantityString = "CC(" + coordToString(this.x) + ", " + coordToString(this.y) + ")";
        if (this.uom) {
            var uomString = this.uom.toString().trim();
            if (uomString) {
                return quantityString + ' ' + uomString;
            }
            else {
                return quantityString;
            }
        }
        else {
            return quantityString;
        }
    }

    toExponential(fractionDigits?: number): string {
        return this.toStringCustom(function(coord: number) { return coord.toExponential(fractionDigits); });
    }

    toFixed(fractionDigits?: number): string {
        return this.toStringCustom(function(coord: number) { return coord.toFixed(fractionDigits); });
    }

    toPrecision(precision?: number): string {
        return this.toStringCustom(function(coord: number) { return coord.toPrecision(precision); });
    }

    toString(radix?: number): string {
        return this.toStringCustom(function(coord: number) { return coord.toString(radix); });
    }

    __lshift__(other: any): CC {
        throw new Error("")
    }

    __rlshift__(other: any): CC {
        throw new Error("")
    }

    /**
     * @method __rshift__
     * @param other {number|CC}
     * @return {CC}
     * @private
     */
    __rshift__(other: number | CC): CC {
        throw new Error("")
    }

    /**
     * @method __rrshift__
     * @param other {number|CC}
     * @return {CC}
     * @private
     */
    __rrshift__(other: any): CC {
        throw new Error("")
    }

    /**
     * @method __bang__
     * @return {CC}
     * @private
     */
    __bang__(): CC {
        return this.inv()
    }

    /**
     * @method __pos__
     * @return {CC}
     * @private
     */
    __pos__(): CC {
        return this
    }

    /**
     * @method __neg__
     * @return {CC}
     * @private
     */
    __neg__(): CC {
        return this.neg()
    }

    /**
     * @method __tilde__
     * @return {CC}
     * @private
     */
    __tilde__(): CC {
        return new CC(this.x, -this.y)
    }
}
