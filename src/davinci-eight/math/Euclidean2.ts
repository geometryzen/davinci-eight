import Euclidean2Error = require('../math/Euclidean2Error')
import extE2 = require('../math/extE2')
import lcoE2 = require('../math/lcoE2')
import rcoE2 = require('../math/rcoE2')
import Measure = require('../math/Measure')
import mulE2 = require('../math/mulE2')
import mulG2 = require('../math/mulG2')
import scpE2 = require('../math/scpE2')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import Unit = require('../math/Unit')

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x;
    }
    else {
        throw new Euclidean2Error("Argument '" + name + "' must be a number");
    }
}

function assertArgEuclidean2(name: string, arg: Euclidean2): Euclidean2 {
    if (arg instanceof Euclidean2) {
        return arg;
    }
    else {
        throw new Euclidean2Error("Argument '" + arg + "' must be a Euclidean2");
    }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
    if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom;
    }
    else {
        throw new Euclidean2Error("Argument '" + uom + "' must be a Unit or undefined");
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
    uom: Unit,
    m: Euclidean2) {
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
    if (typeof m !== 'undefined') {
        assertArgEuclidean2('m', m);
        m.w = x00;
        m.x = x01;
        m.y = x10;
        m.xy = x11;
        m.uom = uom;
    }
    else {
        return new Euclidean2(x00, x01, x10, x11, uom);
    }
};

class Euclidean2 implements Measure<Euclidean2> {
    public w: number;
    public x: number;
    public y: number;
    public xy: number;
    public uom: Unit;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} xy The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, y: number, xy: number, uom?: Unit) {
        this.w = assertArgNumber('w', w);
        this.x = assertArgNumber('x', x);
        this.y = assertArgNumber('y', y);
        this.xy = assertArgNumber('xy', xy);
        this.uom = assertArgUnitOrUndefined('uom', uom);
        if (this.uom && this.uom.scale !== 1) {
            var scale: number = this.uom.scale;
            this.w *= scale;
            this.x *= scale;
            this.y *= scale;
            this.xy *= scale;
            this.uom = new Unit(1, uom.dimensions, uom.labels);
        }
    }

    fromCartesian(w: number, x: number, y: number, xy: number, uom: Unit): Euclidean2 {
        assertArgNumber('w', w);
        assertArgNumber('x', x);
        assertArgNumber('y', y);
        assertArgNumber('xy', xy);
        assertArgUnitOrUndefined('uom', uom);
        return new Euclidean2(w, x, y, xy, uom);
    }

    fromPolar(w: number, r: number, theta: number, s: number, uom: Unit): Euclidean2 {
        assertArgNumber('w', w);
        assertArgNumber('r', r);
        assertArgNumber('theta', theta);
        assertArgNumber('s', s);
        assertArgUnitOrUndefined('uom', uom);
        return new Euclidean2(w, r * Math.cos(theta), r * Math.sin(theta), s, uom);
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
                throw new Euclidean2Error("index must be in the range [0..3]");
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

    scalarMultiply(rhs: number): Euclidean2 {
        return new Euclidean2(this.w * rhs, this.x * rhs, this.y * rhs, this.xy * rhs, this.uom);
    }

    div(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit.div(this.uom, rhs.uom), undefined);
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

    static align(a: number[], b: number[]): number[] {
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

    align(rhs: Euclidean2): Euclidean2 {
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

    static wedge(a: number[], b: number[]): number[] {
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

    wedge(rhs: Euclidean2): Euclidean2 {
        assertArgEuclidean2('rhs', rhs);
        var xs = Euclidean2.wedge(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
    }

    __wedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var rhs: Euclidean2 = other;
            return this.wedge(rhs);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return this.wedge(new Euclidean2(w, 0, 0, 0, undefined));
        }
    }

    __rwedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            var lhs: Euclidean2 = other;
            return lhs.wedge(this);
        }
        else if (typeof other === 'number') {
            var w: number = other;
            return new Euclidean2(w, 0, 0, 0, undefined).wedge(this);
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
            return this.align(other);
        }
        else if (typeof other === 'number') {
            return this.align(new Euclidean2(other, 0, 0, 0, undefined));
        }
    }

    __rvbar__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return (<Euclidean2>other).align(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).align(this);
        }
    }

    pow(exponent: Euclidean2): Euclidean2 {
        // assertArgEuclidean2('exponent', exponent);
        throw new Euclidean2Error('pow');
    }

    __pos__(): Euclidean2 {
        return this;
    }

    __neg__(): Euclidean2 {
        return new Euclidean2(-this.w, -this.x, -this.y, -this.xy, this.uom);
    }

    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2 {
        return new Euclidean2(this.w, this.x, this.y, -this.xy, this.uom);
    }

    grade(index: number): Euclidean2 {
        assertArgNumber('index', index);
        switch (index) {
            case 0:
                return new Euclidean2(this.w, 0, 0, 0, this.uom);
            case 1:
                return new Euclidean2(0, this.x, this.y, 0, this.uom);
            case 2:
                return new Euclidean2(0, 0, 0, this.xy, this.uom);
            default:
                return new Euclidean2(0, 0, 0, 0, this.uom);
        }
    }

    cos(): Euclidean2 {
        throw new Euclidean2Error('cos');
    }

    cosh(): Euclidean2 {
        throw new Euclidean2Error('cosh');
    }

    exp(): Euclidean2 {
        Unit.assertDimensionless(this.uom);
        var expW = Math.exp(this.w);
        var cosXY = Math.cos(this.xy);
        var sinXY = Math.sin(this.xy);
        return new Euclidean2(expW * cosXY, 0, 0, expW * sinXY, this.uom);
    }

    norm(): Euclidean2 {
        return new Euclidean2(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy), 0, 0, 0, this.uom);
    }

    quad(): Euclidean2 {
        return new Euclidean2(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy, 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    sin(): Euclidean2 {
        throw new Euclidean2Error('sin');
    }

    sinh(): Euclidean2 {
        throw new Euclidean2Error('sinh');
    }

    unitary(): Euclidean2 {
        throw new Euclidean2Error('unitary');
    }
    /**
     * @method gradeZero
     * @return {number}
     */
    gradeZero(): number {
        return this.w;
    }

    isNaN(): boolean { return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy); }

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