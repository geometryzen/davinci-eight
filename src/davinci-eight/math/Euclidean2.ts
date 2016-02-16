import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import extE2 from './extE2';
import gauss from './gauss';
import GeometricElement from './GeometricElement';
import GeometricOperators from './GeometricOperators';
import GeometricE2 from './GeometricE2';
import lcoE2 from './lcoE2';
import rcoE2 from './rcoE2';
import ImmutableMeasure from './ImmutableMeasure';
import mulE2 from './mulE2';
import notImplemented from '../i18n/notImplemented';
import readOnly from '../i18n/readOnly';
import scpE2 from './scpE2';
import SpinorE2 from './SpinorE2';
import stringFromCoordinates from './stringFromCoordinates';
import TrigMethods from './TrigMethods';
import Unit from './Unit';
import VectorE2 from './VectorE2';

/**
 * @module EIGHT
 * @submodule math
 */

function add00(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
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

function add01(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
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

function add10(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
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

function add11(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
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

function subE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
        case 0: {
            x = +(a0 - b0);
        }
            break;
        case 1: {
            x = +(a1 - b1);
        }
            break;
        case 2: {
            x = +(a2 - b2);
        }
            break;
        case 3: {
            x = +(a3 - b3);
        }
            break;
        default: {
            throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}

/**
 * @class Euclidean2
 */
export default class Euclidean2 implements ImmutableMeasure<Euclidean2>, GeometricE2, GeometricElement<Euclidean2, Euclidean2, SpinorE2, VectorE2>, GeometricOperators<Euclidean2>, TrigMethods<Euclidean2> {
    private _w: number;
    private _x: number;
    private _y: number;
    public xy: number;
    public uom: Unit;

    /**
     * @property _zero
     * @type Euclidean2
     * @static
     * @private
     */
    private static _zero = new Euclidean2(0, 0, 0, 0)

    /**
     * @property zero
     * @type Euclidean2
     * @static
     * @readOnly
     */
    public static get zero() {
        return Euclidean2._zero
    }
    public static set zero(unused) {
        throw new Error(readOnly('zero').message)
    }

    /**
     * @property _one
     * @type Euclidean2
     * @static
     * @private
     */
    private static _one = new Euclidean2(1, 0, 0, 0)

    /**
     * @property one
     * @type Euclidean2
     * @static
     * @readOnly
     */
    public static get one() {
        return Euclidean2._one
    }
    public static set one(unused) {
        throw new Error(readOnly('one').message)
    }

    /**
     * @property _e2
     * @type Euclidean2
     * @static
     * @private
     */
    private static _e1 = new Euclidean2(0, 1, 0, 0)

    /**
     * @property e1
     * @type Euclidean2
     * @static
     * @readOnly
     */
    public static get e1() {
        return Euclidean2._e1
    }
    public static set e1(unused) {
        throw new Error(readOnly('e1').message)
    }

    /**
     * @property _e2
     * @type Euclidean2
     * @static
     * @private
     */
    private static _e2 = new Euclidean2(0, 0, 1, 0)

    /**
     * @property e2
     * @type Euclidean2
     * @static
     * @readOnly
     */
    public static get e2() {
        return Euclidean2._e2
    }
    public static set e2(unused) {
        throw new Error(readOnly('e2').message)
    }

    /**
     * @property _I
     * @type Euclidean2
     * @static
     * @private
     */
    private static _I = new Euclidean2(0, 0, 0, 1)

    /**
     * @property I
     * @type Euclidean2
     * @static
     * @readOnly
     */
    public static get I() {
        return Euclidean2._I
    }
    public static set I(unused) {
        throw new Error(readOnly('I').message)
    }

    /**
     * @property kilogram
     * @type Euclidean2
     * @static
     */
    public static kilogram = new Euclidean2(1, 0, 0, 0, Unit.KILOGRAM)

    /**
     * @property meter
     * @type Euclidean2
     * @static
     */
    public static meter = new Euclidean2(1, 0, 0, 0, Unit.METER)

    /**
     * @property second
     * @type Euclidean2
     * @static
     */
    public static second = new Euclidean2(1, 0, 0, 0, Unit.SECOND)

    /**
     * @property coulomb
     * @type Euclidean2
     * @static
     */
    public static coulomb = new Euclidean2(1, 0, 0, 0, Unit.COULOMB)

    /**
     * @property ampere
     * @type Euclidean2
     * @static
     */
    public static ampere = new Euclidean2(1, 0, 0, 0, Unit.AMPERE)

    /**
     * @property kelvin
     * @type Euclidean2
     * @static
     */
    public static kelvin = new Euclidean2(1, 0, 0, 0, Unit.KELVIN)

    /**
     * @property mole
     * @type Euclidean2
     * @static
     */
    public static mole = new Euclidean2(1, 0, 0, 0, Unit.MOLE)

    /**
     * @property candela
     * @type Euclidean2
     * @static
     */
    public static candela = new Euclidean2(1, 0, 0, 0, Unit.CANDELA)

    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param α {number} The scalar part of the multivector.
     * @param x {number} The vector component of the multivector in the x-direction.
     * @param y {number} The vector component of the multivector in the y-direction.
     * @param β {number} The pseudoscalar part of the multivector.
     * @param [uom] The optional unit of measure.
     */
    constructor(α: number, x: number, y: number, β: number, uom?: Unit) {
        this._w = α
        this._x = x
        this._y = y
        this.xy = β
        this.uom = uom
        if (this.uom && this.uom.multiplier !== 1) {
            const multiplier: number = this.uom.multiplier;
            this._w *= multiplier;
            this._x *= multiplier;
            this._y *= multiplier;
            this.xy *= multiplier;
            this.uom = new Unit(1, uom.dimensions, uom.labels);
        }
    }

    /**
     * The scalar part of this multivector.
     * @property α
     * @type number
     * @readOnly
     */
    get α(): number {
        return this._w
    }
    set α(unused) {
        throw new Error(readOnly('α').message)
    }

    /**
     * The coordinate corresponding to the <b>e1</b> basis vector, without the unit of measure.
     *
     * @property x
     * @type number
     * @readOnly
     */
    get x(): number {
        return this._x
    }
    set x(unused) {
        throw new Error(readOnly('x').message)
    }

    /**
     * The coordinate corresponding to the <b>e2</b> basis vector, without the unit of measure.
     *
     * @property y
     * @type number
     * @readOnly
     */
    get y(): number {
        return this._y
    }
    set y(unused) {
        throw new Error(readOnly('y').message)
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @type number
     * @readOnly
     */
    get β(): number {
        return this.xy
    }
    set β(unused) {
        throw new Error(readOnly('β').message)
    }

    // FIXME: Replace x & y with a VectorE2, a
    fromCartesian(α: number, x: number, y: number, β: number, uom: Unit): Euclidean2 {
        return new Euclidean2(α, x, y, β, uom)
    }

    fromPolar(α: number, r: number, θ: number, β: number, uom: Unit): Euclidean2 {
        return new Euclidean2(α, r * Math.cos(θ), r * Math.sin(θ), β, uom)
    }

    get coords(): number[] {
        return [this._w, this._x, this._y, this.xy];
    }

    coordinate(index: number): number {
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
    }

    // FIXME: This function forces the creation of temporary arrays.
    private static add(a: number[], b: number[]): number[] {
        const a00 = a[0];
        const a01 = a[1];
        const a10 = a[2];
        const a11 = a[3];
        const b00 = b[0];
        const b01 = b[1];
        const b10 = b[2];
        const b11 = b[3];
        const x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
        const x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
        const x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
        const x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return [x00, x01, x10, x11];
    }

    add(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.add(this.coords, rhs.coords);
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
    }

    addPseudo(β: number): Euclidean2 {
        return new Euclidean2(this._w, this._x, this._y, this.β + β, this.uom)
    }

    addScalar(α: number): Euclidean2 {
        return new Euclidean2(this._w + α, this._x, this._y, this.β, this.uom)
    }

    adj(): Euclidean2 {
        throw new Error("TODO: adj")
    }

    __add__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.add(other);
        }
        else if (typeof other === 'number') {
            return this.add(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __radd__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return (<Euclidean2>other).add(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).add(this);
        }
    }

    /**
     * @method angle
     * @return {Euclidean2}
     */
    angle(): Euclidean2 {
        return this.log().grade(2);
    }

    clone(): Euclidean2 {
        return this;
    }

    conj(): Euclidean2 {
        throw new Error(notImplemented('conj').message)
    }

    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2) {
        const α = b3(t, this._w, controlBegin.α, controlEnd.α, endPoint.α)
        const x = b3(t, this._x, controlBegin.x, controlEnd.x, endPoint.x)
        const y = b3(t, this._y, controlBegin.y, controlEnd.y, endPoint.y)
        const β = b3(t, this.xy, controlBegin.β, controlEnd.β, endPoint.β)
        return new Euclidean2(α, x, y, β, this.uom);
    }

    /**
     * @method direction
     * @return {Euclidean2}
     * @chainable
     */
    public direction(): Euclidean2 {
        const m: number = this.magnitudeSansUnits()
        if (m !== 1) {
            return new Euclidean2(this.α / m, this.x / m, this.y / m, this.β / m)
        }
        else {
            if (this.uom) {
                return new Euclidean2(this.α, this.x, this.y, this.β)
            }
            else {
                return this
            }
        }
    }

    distanceTo(point: GeometricE2): number {
        throw new Error(notImplemented('diistanceTo').message)
    }

    equals(point: GeometricE2): boolean {
        throw new Error(notImplemented('equals').message)
    }

    private static sub(a: number[], b: number[]): number[] {
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
    }

    sub(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.sub(this.coords, rhs.coords);
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
    }

    __sub__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.sub(other);
        }
        else if (typeof other === 'number') {
            return this.sub(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __rsub__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return (<Euclidean2>other).sub(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).sub(this);
        }
    }

    mul(rhs: Euclidean2): Euclidean2 {
        const a0 = this._w
        const a1 = this._x
        const a2 = this._y
        const a3 = this.xy
        const b0 = rhs._w
        const b1 = rhs._x
        const b2 = rhs._y
        const b3 = rhs.xy
        // TODO: Split into four functions to avoid conditionals or inline.
        const c0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        const c1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        const c2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        const c3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return new Euclidean2(c0, c1, c2, c3, Unit.mul(this.uom, rhs.uom))
    }

    __mul__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.mul(other);
        }
        else if (typeof other === 'number') {
            return this.mul(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __rmul__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var lhs: Euclidean2 = other;
            return lhs.mul(this);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return new Euclidean2(w, 0, 0, 0, undefined).mul(this);
        }
    }

    scale(α: number): Euclidean2 {
        return new Euclidean2(this._w * α, this._x * α, this._y * α, this.xy * α, this.uom);
    }

    div(rhs: Euclidean2): Euclidean2 {
        return this.mul(rhs.inv())
    }

    divByScalar(α: number): Euclidean2 {
        return new Euclidean2(this._w / α, this._x / α, this._y / α, this.xy / α, this.uom);
    }

    __div__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.div(other);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return this.div(new Euclidean2(w, 0, 0, 0, undefined));
        }
    }

    __rdiv__(other: number | Euclidean2): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.div(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).div(this);
        }
    }

    scp(rhs: Euclidean2): Euclidean2 {

        const a0 = this.α
        const a1 = this.x
        const a2 = this.y
        const a3 = this.β

        const b0 = rhs.α
        const b1 = rhs.x
        const b2 = rhs.y
        const b3 = rhs.β

        const c0 = scpE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        return new Euclidean2(c0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
    }

    private static ext(a: number[], b: number[]): number[] {
        const a0: number = a[0];
        const a1: number = a[1];
        const a2: number = a[2];
        const a3: number = a[3];
        const b0: number = b[0];
        const b1: number = b[1];
        const b2: number = b[2];
        const b3: number = b[3];
        const x0: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        const x1: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        const x2: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        const x3: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    ext(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.ext(this.coords, rhs.coords);
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
    }

    __wedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var rhs: Euclidean2 = other;
            return this.ext(rhs);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return this.ext(new Euclidean2(w, 0, 0, 0, undefined));
        }
    }

    __rwedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var lhs: Euclidean2 = other;
            return lhs.ext(this);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return new Euclidean2(w, 0, 0, 0, undefined).ext(this);
        }
    }

    private static lshift(a: number[], b: number[]): number[] {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    lerp(target: Euclidean2, α: number): Euclidean2 {
        throw new Error(notImplemented('lerp').message)
    }

    lco(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.lshift(this.coords, rhs.coords);
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
    }

    __lshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var rhs: Euclidean2 = other;
            return this.lco(rhs);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return this.lco(new Euclidean2(w, 0, 0, 0, undefined));
        }
    }

    __rlshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var lhs: Euclidean2 = other;
            return lhs.lco(this);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return new Euclidean2(w, 0, 0, 0, undefined).lco(this);
        }
    }

    private static rshift(a: number[], b: number[]): number[] {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    rco(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.rshift(this.coords, rhs.coords);
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
    }

    __rshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.rco(other);
        }
        else if (typeof other === 'number') {
            return this.rco(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __rrshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return (<Euclidean2>other).rco(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).rco(this);
        }
    }

    __vbar__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.scp(other);
        }
        else if (typeof other === 'number') {
            return this.scp(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __rvbar__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return (<Euclidean2>other).scp(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).scp(this);
        }
    }

    pow(exponent: Euclidean2): Euclidean2 {
        throw new Error(notImplemented('pow').message)
    }

    __bang__(): Euclidean2 {
        return this.inv()
    }

    __pos__(): Euclidean2 {
        return this
    }

    neg(): Euclidean2 {
        return new Euclidean2(-this._w, -this._x, -this._y, -this.β, this.uom)
    }

    __neg__(): Euclidean2 {
        return this.neg()
    }

    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2 {
        return this.rev()
    }

    grade(grade: number): Euclidean2 {
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
    }

    cos(): Euclidean2 {
        throw new Error(notImplemented('cos').message)
    }

    cosh(): Euclidean2 {
        throw new Error(notImplemented('cosh').message)
    }

    exp(): Euclidean2 {
        Unit.assertDimensionless(this.uom);
        var expα = Math.exp(this._w);
        var cosβ = Math.cos(this.β);
        var sinβ = Math.sin(this.β);
        return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
    }

    /**
     * Computes the <em>inverse</em> of this multivector, if it exists.
     *
     * @method inv
     * @return {Euclidean2}
     */
    inv(): Euclidean2 {

        const α = this.α
        const x = this.x
        const y = this.y
        const β = this.β

        const A = [
            [α, x, y, -β],
            [x, α, β, -y],
            [y, -β, α, x],
            [β, -y, x, α]
        ]
        const b = [1, 0, 0, 0]

        const X = gauss(A, b)
        const uom = this.uom ? this.uom.inv() : void 0
        return new Euclidean2(X[0], X[1], X[2], X[3], uom);
    }

    log(): Euclidean2 {
        throw new Error(notImplemented('log').message)
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {Euclidean2}
     */
    magnitude(): Euclidean2 {
        return this.norm();
    }

    magnitudeSansUnits(): number {
        return Math.sqrt(this.squaredNormSansUnits())
    }

    norm(): Euclidean2 {
        return new Euclidean2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
    }

    quad(): Euclidean2 {
        return this.squaredNorm();
    }

    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2) {
        const α = b2(t, this._w, controlPoint.α, endPoint.α)
        const x = b2(t, this._x, controlPoint.x, endPoint.x)
        const y = b2(t, this._y, controlPoint.y, endPoint.y)
        const β = b2(t, this.xy, controlPoint.β, endPoint.β)
        return new Euclidean2(α, x, y, β, this.uom);
    }

    public squaredNorm(): Euclidean2 {
        return new Euclidean2(this.squaredNormSansUnits(), 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    /**
     * Intentionally undocumented.
     */
    public squaredNormSansUnits(): number {
        const α = this._w
        const x = this._x
        const y = this._y
        const β = this.β
        return α * α + x * x + y * y + β * β
    }

    /**
     * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
     *
     *
     * @method reflect
     * @param n {VectorE2}
     * @return {Euclidean2}
     */
    reflect(n: VectorE2): Euclidean2 {
        // TODO: Optimize to minimize object creation and increase performance.
        const m = Euclidean2.fromVectorE2(n)
        return m.mul(this).mul(m).scale(-1)
    }

    rev(): Euclidean2 {
        return new Euclidean2(this._w, this._x, this._y, -this.β, this.uom)
    }

    /**
     * @method rotate
     * @param R {SpinorE2}
     * @return {Euclidean2}
     */
    rotate(R: SpinorE2): Euclidean2 {
        throw new Error(notImplemented('rotate').message)
    }

    sin(): Euclidean2 {
        throw new Error(notImplemented('sin').message)
    }

    sinh(): Euclidean2 {
        throw new Error(notImplemented('sinh').message)
    }

    slerp(target: Euclidean2, α: number): Euclidean2 {
        throw new Error(notImplemented('slerp').message)
    }

    /**
     * @method tan
     * @return {Euclidean2}
     */
    tan(): Euclidean2 {
        return this.sin().div(this.cos())
    }

    isOne(): boolean { return this._w === 1 && this._x === 0 && this._y === 0 && this.xy === 0 }
    isNaN(): boolean { return isNaN(this._w) || isNaN(this._x) || isNaN(this._y) || isNaN(this.xy) }
    isZero(): boolean { return this._w === 0 && this._x === 0 && this._y === 0 && this.xy === 0 }

    toStringCustom(
        coordToString: (x: number) => string,
        labels: string[]): string {
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
    public toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
    }

    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    public toFixed(digits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
    }

    /**
     * @method toString
     * @return {string}
     */
    public toString(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
    }

    toStringIJK(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
    }

    toStringLATEX(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
    }

    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {Euclidean2}
     * @static
     */
    static copy(m: GeometricE2): Euclidean2 {
        if (m instanceof Euclidean2) {
            return m
        }
        else {
            return new Euclidean2(m.α, m.x, m.y, m.β, void 0)
        }
    }

    /**
     * @method fromVectorE2
     * @param vector {VectorE2}
     * @return {Euclidean2}
     * @static
     */
    static fromVectorE2(vector: VectorE2): Euclidean2 {
        if (vector) {
            if (vector instanceof Euclidean2) {
                return new Euclidean2(0, vector.x, vector.y, 0, vector.uom)
            }
            else {
                return new Euclidean2(0, vector.x, vector.y, 0, void 0)
            }
        }
        else {
            return void 0
        }
    }
}
