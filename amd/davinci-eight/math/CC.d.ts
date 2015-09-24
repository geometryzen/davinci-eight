import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
declare class CC implements Measure<CC> {
    /**
     * The real part of the complex number.
     */
    x: number;
    /**
     * The imaginary part of the complex number.
     */
    y: number;
    /**
     * The optional unit of measure.
     */
    uom: Unit;
    /**
     * Constructs a complex number z = (x, y).
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    constructor(x: number, y: number, uom?: Unit);
    coordinates(): number[];
    add(rhs: CC): CC;
    /**
     * __add__ supports operator +(CC, any)
     */
    __add__(other: any): CC;
    /**
     * __radd__ supports operator +(any, CC)
     */
    __radd__(other: any): CC;
    sub(rhs: CC): CC;
    __sub__(other: any): CC;
    __rsub__(other: any): CC;
    mul(rhs: CC): CC;
    __mul__(other: any): CC;
    __rmul__(other: any): CC;
    div(rhs: CC): CC;
    __div__(other: any): CC;
    __rdiv__(other: any): CC;
    wedge(rhs: CC): CC;
    lshift(rhs: CC): CC;
    rshift(rhs: CC): CC;
    pow(exponent: CC): CC;
    cos(): CC;
    cosh(): CC;
    exp(): CC;
    norm(): CC;
    quad(): CC;
    sin(): CC;
    sinh(): CC;
    unit(): CC;
    scalar(): number;
    arg(): number;
    toStringCustom(coordToString: (x: number) => string): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
}
export = CC;
