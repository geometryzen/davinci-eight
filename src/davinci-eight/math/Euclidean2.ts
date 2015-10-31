import extE2 = require('../math/extE2')
import GeometricElement = require('../math/GeometricElement')
import GeometricOperators = require('../math/GeometricOperators')
import GeometricE2 = require('../math/GeometricE2')
import lcoE2 = require('../math/lcoE2')
import rcoE2 = require('../math/rcoE2')
import Measure = require('../math/Measure')
import mulE2 = require('../math/mulE2')
import mulG2 = require('../math/mulG2')
import mustBeInteger = require('../checks/mustBeInteger')
import readOnly = require('../i18n/readOnly')
import scpE2 = require('../math/scpE2')
import SpinorE2 = require('../math/SpinorE2')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import TrigMethods = require('../math/TrigMethods')
import Unit = require('../math/Unit')
import VectorE2 = require('../math/VectorE2')

let exp = Math.exp
let cos = Math.cos
let sin = Math.sin
let sqrt = Math.sqrt

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x;
    }
    else {
        throw new Error("Argument '" + name + "' must be a number");
    }
}

function assertArgEuclidean2(name: string, arg: Euclidean2): Euclidean2 {
    if (arg instanceof Euclidean2) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a Euclidean2");
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

function addE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
            x = +(a0 + b0);
        }
            break;
        case 1: {
            x = +(a1 + b1);
        }
            break;
        case 2: {
            x = +(a2 + b2);
        }
            break;
        case 3: {
            x = +(a3 + b3);
        }
            break;
        default: {
            throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
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

var divide = function(
    a00: number,
    a01: number,
    a10: number,
    a11: number,
    b00: number,
    b01: number,
    b10: number,
    b11: number,
    uom: Unit) {
    var c00: number
    var c01: number
    var c10: number
    var c11: number
    var i00: number
    var i01: number
    var i10: number
    var i11: number
    var k00: number
    var m00: number
    var m01: number
    var m10: number
    var m11: number
    var r00: number
    var r01: number
    var r10: number
    var r11: number
    var s00: number
    var s01: number
    var s10: number
    var s11: number
    var x00: number
    var x01: number
    var x10: number
    var x11: number

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

/**
 * @class Euclidean2
 */
class Euclidean2 implements Measure<Euclidean2>, GeometricE2, GeometricElement<Euclidean2, Euclidean2, SpinorE2, VectorE2>, GeometricOperators<Euclidean2>, TrigMethods<Euclidean2> {
    private w: number;
    public x: number;
    public y: number;
    public xy: number;
    public uom: Unit;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} α The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} β The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, x: number, y: number, β: number, uom?: Unit) {
        this.w = assertArgNumber('α', α);
        this.x = assertArgNumber('x', x);
        this.y = assertArgNumber('y', y);
        this.xy = assertArgNumber('β', β);
        this.uom = assertArgUnitOrUndefined('uom', uom);
        if (this.uom && this.uom.multiplier !== 1) {
            var multiplier: number = this.uom.multiplier;
            this.w *= multiplier;
            this.x *= multiplier;
            this.y *= multiplier;
            this.xy *= multiplier;
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
        return this.xy
    }
    set β(unused) {
        throw new Error(readOnly('β').message)
    }

    // FIXME: Replace x & y with a VectorE2, a
    fromCartesian(α: number, x: number, y: number, β: number, uom: Unit): Euclidean2 {
        assertArgNumber('α', α)
        assertArgNumber('x', x)
        assertArgNumber('y', y)
        assertArgNumber('β', β)
        assertArgUnitOrUndefined('uom', uom)
        return new Euclidean2(α, x, y, β, uom)
    }

    fromPolar(α: number, r: number, θ: number, β: number, uom: Unit): Euclidean2 {
        assertArgNumber('α', α)
        assertArgNumber('r', r)
        assertArgNumber('θ', θ)
        assertArgNumber('β', β)
        assertArgUnitOrUndefined('uom', uom)
        return new Euclidean2(α, r * cos(θ), r * sin(θ), β, uom)
    }

    coordinates(): number[] {
        return [this.w, this.x, this.y, this.xy];
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
                return this.xy;
            default:
                throw new Error("index must be in the range [0..3]");
        }
    }

    static add(a: number[], b: number[]): number[] {
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
    }

    add(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.add(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
    }

    addPseudo(β: number): Euclidean2 {
        return new Euclidean2(this.α, this.x, this.y, this.β + β, this.uom)
    }

    addScalar(α: number): Euclidean2 {
        return new Euclidean2(this.α + α, this.x, this.y, this.β, this.uom)
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

    conj(): Euclidean2 {
        throw new Error("TODO: adj")
    }

    static sub(a: number[], b: number[]): number[] {
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
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.sub(this.coordinates(), rhs.coordinates());
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
        assertArgEuclidean2('rhs', rhs)
        let a0 = this.w
        let a1 = this.x
        let a2 = this.y
        let a3 = this.xy
        let b0 = rhs.w
        let b1 = rhs.x
        let b2 = rhs.y
        let b3 = rhs.xy
        let c0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        let c1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        let c2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        let c3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
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
        return new Euclidean2(this.w * α, this.x * α, this.y * α, this.xy * α, this.uom);
    }

    div(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit.div(this.uom, rhs.uom))
    }

    divByScalar(α: number): Euclidean2 {
        return new Euclidean2(this.w / α, this.x / α, this.y / α, this.xy / α, this.uom);
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

    __rdiv__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var lhs: Euclidean2 = other;
            return lhs.div(this);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return new Euclidean2(w, 0, 0, 0, undefined).div(this);
        }
    }

    static scp(a: number[], b: number[]): number[] {
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
    }

    scp(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs)
        let a0 = this.w
        let a1 = this.x
        let a2 = this.y
        let a3 = this.xy
        let b0 = this.w
        let b1 = this.x
        let b2 = this.y
        let b3 = this.xy
        let c0 = scpE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        return new Euclidean2(c0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
    }

    static ext(a: number[], b: number[]): number[] {
        var a0: number = a[0];
        var a1: number = a[1];
        var a2: number = a[2];
        var a3: number = a[3];
        var b0: number = b[0];
        var b1: number = b[1];
        var b2: number = b[2];
        var b3: number = b[3];
        var x0: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    ext(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.ext(this.coordinates(), rhs.coordinates());
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

    static lshift(a: number[], b: number[]): number[] {
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
        // FIXME: TODO
        return this
    }

    lco(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.lshift(this.coordinates(), rhs.coordinates());
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

    static rshift(a: number[], b: number[]): number[] {
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
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.rshift(this.coordinates(), rhs.coordinates());
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
        // assertArgEuclidean2('exponent', exponent);
        throw new Error('pow');
    }

    __pos__(): Euclidean2 {
        return this;
    }

    neg(): Euclidean2 {
        return new Euclidean2(-this.α, -this.x, -this.y, -this.β, this.uom);
    }

    __neg__(): Euclidean2 {
        return this.neg()
    }

    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2 {
        return new Euclidean2(this.α, this.x, this.y, -this.β, this.uom);
    }

    grade(grade: number): Euclidean2 {
        mustBeInteger('grade', grade);
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
    }

    cos(): Euclidean2 {
        throw new Error('cos');
    }

    cosh(): Euclidean2 {
        throw new Error('cosh');
    }

    exp(): Euclidean2 {
        Unit.assertDimensionless(this.uom);
        var expα = exp(this.α);
        var cosβ = cos(this.β);
        var sinβ = sin(this.β);
        return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
    }

    inv(): Euclidean2 {
        throw new Error('inv');
    }

    log(): Euclidean2 {
        throw new Error('log');
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm())
    }

    norm(): Euclidean2 {
        return new Euclidean2(this.magnitude(), 0, 0, 0, this.uom);
    }

    quad(): Euclidean2 {
        return new Euclidean2(this.squaredNorm(), 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    squaredNorm(): number {
        return this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy;
    }

    reflect(n: VectorE2): Euclidean2 {
        throw new Error('reflect');
    }

    rev(): Euclidean2 {
        throw new Error('rev');
    }

    rotate(R: SpinorE2): Euclidean2 {
        throw new Error('rotate');
    }

    sin(): Euclidean2 {
        throw new Error('sin');
    }

    sinh(): Euclidean2 {
        throw new Error('sinh');
    }

    slerp(target: Euclidean2, α: number): Euclidean2 {
        // FIXME: TODO
        return this
    }
    unitary(): Euclidean2 {
        throw new Error('unitary');
    }

    isOne(): boolean { return this.w === 1 && this.x === 0 && this.y === 0 && this.xy === 0 }
    isNaN(): boolean { return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy) }
    isZero(): boolean { return this.w === 0 && this.x === 0 && this.y === 0 && this.xy === 0 }

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
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
    }

    toFixed(digits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
    }

    toString(): string {
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
}

export = Euclidean2;