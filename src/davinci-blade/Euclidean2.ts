import GeometricQuantity = require('davinci-blade/GeometricQuantity');
import Measure = require('davinci-blade/Measure');
import Unit = require('davinci-blade/Unit');

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
function mulE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
            x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
        case 1: {
            x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
        }
        break;
        case 2: {
            x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
        }
        break;
        case 3: {
            x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
        default: {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}
function extE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
            x = +(a0 * b0);
        }
        break;
        case 1: {
            x = +(a0 * b1 + a1 * b0);
        }
        break;
        case 2: {
            x = +(a0 * b2 + a2 * b0);
        }
        break;
        case 3: {
            x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
        default: {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}
function lcoE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
            x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
            break;
        case 1: {
            x = +(a0 * b1 - a2 * b3);
        }
            break;
        case 2: {
            x = +(a0 * b2 + a1 * b3);
        }
            break;
        case 3: {
            x = +(a0 * b3);
        }
            break;
        default: {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}
function rcoE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
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
            x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
        case 1: {
            x = +(- a1 * b0 - a3 * b2);
        }
        break;
        case 2: {
            x = +(- a2 * b0 + a3 * b1);
        }
        break;
        case 3: {
            x = +(a3 * b0);
        }
        break;
        default: {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}
function stringFromCoordinates(coordinates: number[], labels: string[]): string {
    var i: number, _i: number, _ref: number;
    var str: string;
    var sb: string[] = [];
    var append = function(coord: number, label: string): void {
        var n;
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            } else {
                sb.push("-");
            }
            n = Math.abs(coord);
            if (n === 1) {
                sb.push(label);
            } else {
                sb.push(n.toString());
                if (label !== "1") {
                    sb.push("*");
                    sb.push(label);
                }
            }
        }
    };
    for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        append(coordinates[i], labels[i]);
    }
    if (sb.length > 0) {
        str = sb.join("");
    } else {
        str = "0";
    }
    return str;
}
var divide = function(a00, a01, a10, a11, b00, b01, b10, b11, m) {
    var c00, c01, c10, c11, i00, i01, i10, i11, k00, m00, m01, m10, m11, r00, r01, r10, r11, s00, s01, s10, s11, x00, x01, x10, x11;

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
        m.w = x00;
        m.x = x01;
        m.y = x10;
        return m.xy = x11;
    } else {
        return new Euclidean2(x00, x01, x10, x11);
    }
};

class Euclidean2 implements GeometricQuantity<Euclidean2> {
    public w: number;
    public x: number;
    public y: number;
    public xy: number;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} xy The pseudoscalar part of the multivector.
     */
    constructor(w: number, x: number, y: number, xy: number) {
        this.w = w || 0;
        this.x = x;
        this.y = y;
        this.xy = xy;
    }

    fromCartesian(w: number, x: number, y: number, xy: number): Euclidean2 {
        return new Euclidean2(w, x, y, xy);
    }

    fromPolar(w: number, r: number, theta: number, s: number): Euclidean2 {
        return new Euclidean2(w, r * Math.cos(theta), r * Math.sin(theta), s);
    }

    coordinates(): number[] {
        return [this.w, this.x, this.y, this.xy];
    }

    coordinate(index: number): number {
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
        var a00, a01, a10, a11, b00, b01, b10, b11, x00, x01, x10, x11;

        a00 = a[0];
        a01 = a[1];
        a10 = a[2];
        a11 = a[3];
        b00 = b[0];
        b01 = b[1];
        b10 = b[2];
        b11 = b[3];
        x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
        x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
        x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
        x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return [x00, x01, x10, x11];
    }

    add(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.add(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    __add__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.add(other);
        }
        else if (typeof other === 'number') {
            return this.add(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __radd__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.add(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).add(this);
        }
        else {
            return;
        }
    }

    static sub(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    sub(rhs: Euclidean2): Euclidean2 {
        var xs;

        xs = Euclidean2.sub(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    __sub__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.sub(other);
        }
        else if (typeof other === 'number') {
            return this.sub(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rsub__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.sub(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).sub(this);
        }
        else {
            return;
        }
    }

    static mul(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        x1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        x2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        x3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    mul(rhs: any): Euclidean2 {
        var xs;

        if (typeof rhs === 'number') {
            return this.scalarMultiply(rhs);
        } else {
            xs = Euclidean2.mul(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        }
    }

    __mul__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.mul(other);
        }
        else if (typeof other === 'number') {
            return this.mul(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rmul__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.mul(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).mul(this);
        }
        else {
            return;
        }
    }

    scalarMultiply(rhs: number): Euclidean2 {
        return new Euclidean2(this.w * rhs, this.x * rhs, this.y * rhs, this.xy * rhs);
    }

    div(rhs: any): Euclidean2 {
        if (typeof rhs === 'number') {
            return new Euclidean2(this.w / rhs, this.x / rhs, this.y / rhs, this.xy / rhs);
        } else {
            return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, void 0);
        }
    }

    __div__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.div(other);
        }
        else if (typeof other === 'number') {
            return this.div(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rdiv__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.div(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).div(this);
        }
        else {
            return;
        }
    }

    static splat(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        x1 = 0;
        x2 = 0;
        x3 = 0;
        return [x0, x1, x2, x3];
    }

    splat(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.splat(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    static wedge(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        x1 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        x2 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        x3 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    wedge(rhs: Euclidean2): Euclidean2 {
        var xs = Euclidean2.wedge(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    __wedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.wedge(other);
        }
        else if (typeof other === 'number') {
            return this.wedge(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rwedge__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.wedge(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).wedge(this);
        }
        else {
            return;
        }
    }

    static lshift(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    lshift(rhs: Euclidean2): Euclidean2 {
        var xs;

        xs = Euclidean2.lshift(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    __lshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.lshift(other);
        }
        else if (typeof other === 'number') {
            return this.lshift(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rlshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.lshift(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).lshift(this);
        }
        else {
            return;
        }
    }

    static rshift(a: number[], b: number[]): number[] {
        var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;

        a0 = a[0];
        a1 = a[1];
        a2 = a[2];
        a3 = a[3];
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return [x0, x1, x2, x3];
    }

    rshift(rhs: Euclidean2): Euclidean2 {
        var xs;

        xs = Euclidean2.rshift(this.coordinates(), rhs.coordinates());
        return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
    }

    __rshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.rshift(other);
        }
        else if (typeof other === 'number') {
            return this.rshift(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rrshift__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.rshift(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).rshift(this);
        }
        else {
            return;
        }
    }

    __vbar__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return this.splat(other);
        }
        else if (typeof other === 'number') {
            return this.splat(new Euclidean2(other,0,0,0));
        }
        else {
            return;
        }
    }

    __rvbar__(other: any): Euclidean2 {
        if (other instanceof Euclidean2) {
            return other.splat(this);
        }
        else if (typeof other === 'number') {
            return new Euclidean2(other,0,0,0).splat(this);
        }
        else {
            return;
        }
    }

    __pos__(): Euclidean2 {
        return this;
    }

    __neg__(): Euclidean2 {
        return new Euclidean2(-this.w, -this.x, -this.y, -this.xy);
    }

    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2 {
        return new Euclidean2(this.w, this.x, this.y, -this.xy);
    }

    grade(index: number): Euclidean2 {
        switch (index) {
            case 0:
                return new Euclidean2(this.w, 0, 0, 0);
            case 1:
                return new Euclidean2(0, this.x, this.y, 0);
            case 2:
                return new Euclidean2(0, 0, 0, this.xy);
            default:
                return new Euclidean2(0, 0, 0, 0);
        }
    }

    norm(): Euclidean2 {return new Euclidean2(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy), 0, 0, 0);}

    quad(): Euclidean2 {return new Euclidean2(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy, 0, 0, 0);}

    isNaN(): boolean {return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy);}

    toString(): string {return stringFromCoordinates([this.w, this.x, this.y, this.xy], ["1", "e1", "e2", "e12"]);}

    toStringIJK(): string {
        return stringFromCoordinates(this.coordinates(), ["1", "i", "j", "I"]);
    }

    toStringLATEX(): string {
        return stringFromCoordinates(this.coordinates(), ["1", "e_{1}", "e_{2}", "e_{12}"]);
    }
}

export = Euclidean2;