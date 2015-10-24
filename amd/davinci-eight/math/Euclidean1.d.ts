import Euclidean1Coords = require('../math/Euclidean1Coords');
import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
declare class Euclidean1 implements Measure<Euclidean1> {
    w: number;
    x: number;
    uom: Unit;
    /**
     * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean1
     * @constructor
     * @param {number} w The grade zero part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, uom?: Unit);
    /**
     * @method clone
     * @return {Euclidean1}
     */
    clone(): Euclidean1;
    coordinates(): number[];
    copy(source: Euclidean1Coords): Euclidean1;
    difference(a: Euclidean1Coords, b: Euclidean1Coords): Euclidean1;
    add(rhs: Euclidean1): Euclidean1;
    sub(rhs: Euclidean1): Euclidean1;
    mul(rhs: Euclidean1): Euclidean1;
    div(rhs: Euclidean1): Euclidean1;
    align(rhs: Euclidean1): Euclidean1;
    wedge(rhs: Euclidean1): Euclidean1;
    conL(rhs: Euclidean1): Euclidean1;
    conR(rhs: Euclidean1): Euclidean1;
    pow(exponent: Euclidean1): Euclidean1;
    cos(): Euclidean1;
    cosh(): Euclidean1;
    exp(): Euclidean1;
    norm(): Euclidean1;
    quad(): Euclidean1;
    sin(): Euclidean1;
    sinh(): Euclidean1;
    unitary(): Euclidean1;
    gradeZero(): number;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
}
export = Euclidean1;
