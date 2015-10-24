import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
/**
 * @class Complex
 */
declare class Complex implements Measure<Complex> {
    /**
     * The real part of the complex number.
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * The imaginary part of the complex number.
     * @property y
     * @type {number}
     */
    y: number;
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     */
    uom: Unit;
    /**
     * @class Complex
     * @constructor
     * Constructs a complex number z = (x, y).
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    constructor(x: number, y: number, uom?: Unit);
    coordinates(): number[];
    add(rhs: Complex): Complex;
    /**
     * __add__ supports operator +(Complex, any)
     */
    __add__(other: any): Complex;
    /**
     * __radd__ supports operator +(any, Complex)
     */
    __radd__(other: any): Complex;
    sub(rhs: Complex): Complex;
    __sub__(other: any): Complex;
    __rsub__(other: any): Complex;
    mul(rhs: Complex): Complex;
    __mul__(other: any): Complex;
    __rmul__(other: any): Complex;
    div(rhs: Complex): Complex;
    __div__(other: any): Complex;
    __rdiv__(other: any): Complex;
    /**
     * @method align
     * @param rhs {Complex}
     * @return {Complex}
     */
    align(rhs: Complex): Complex;
    wedge(rhs: Complex): Complex;
    conL(rhs: Complex): Complex;
    conR(rhs: Complex): Complex;
    pow(exponent: Complex): Complex;
    cos(): Complex;
    cosh(): Complex;
    exp(): Complex;
    norm(): Complex;
    quad(): Complex;
    sin(): Complex;
    sinh(): Complex;
    unitary(): Complex;
    /**
     * @method gradeZero
     * @return {number}
     */
    gradeZero(): number;
    arg(): number;
    toStringCustom(coordToString: (x: number) => string): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
}
export = Complex;
