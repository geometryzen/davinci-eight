import Euclidean1Coords = require('../math/Euclidean1Coords');
import ImmutableMeasure = require('../math/ImmutableMeasure');
import Unit = require('../math/Unit');
/**
 * @class Euclidean1
 */
declare class Euclidean1 implements ImmutableMeasure<Euclidean1> {
    private w;
    private x;
    uom: Unit;
    /**
     * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean1
     * @constructor
     * @param {number} α The grade zero part of the multivector.
     * @param {number} β The vector component of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, β: number, uom?: Unit);
    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    α: number;
    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @return {number}
     */
    β: number;
    coords: number[];
    copy(source: Euclidean1Coords): Euclidean1;
    difference(a: Euclidean1Coords, b: Euclidean1Coords): Euclidean1;
    add(rhs: Euclidean1): Euclidean1;
    /**
     * @method angle
     * @return {Euclidean1}
     */
    angle(): Euclidean1;
    sub(rhs: Euclidean1): Euclidean1;
    mul(rhs: Euclidean1): Euclidean1;
    div(rhs: Euclidean1): Euclidean1;
    divByScalar(α: number): Euclidean1;
    scp(rhs: Euclidean1): Euclidean1;
    ext(rhs: Euclidean1): Euclidean1;
    lco(rhs: Euclidean1): Euclidean1;
    lerp(target: Euclidean1, α: number): Euclidean1;
    log(): Euclidean1;
    rco(rhs: Euclidean1): Euclidean1;
    pow(exponent: Euclidean1): Euclidean1;
    cos(): Euclidean1;
    cosh(): Euclidean1;
    exp(): Euclidean1;
    norm(): Euclidean1;
    quad(): Euclidean1;
    scale(α: number): Euclidean1;
    sin(): Euclidean1;
    sinh(): Euclidean1;
    slerp(target: Euclidean1, α: number): Euclidean1;
    direction(): Euclidean1;
    grade(grade: number): Euclidean1;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
}
export = Euclidean1;
