import Unit = require('../math/Unit');
interface Measure<T> {
    /**
     * The scalar part of the measure, as a <code>number</code>.
     */
    α: number;
    /**
     * The pseudoscalar part of the measure, as a <code>number</code>.
     */
    β: number;
    coords: number[];
    uom: Unit;
    add(rhs: T): T;
    angle(): T;
    cos(): T;
    cosh(): T;
    div(rhs: T): T;
    divByScalar(α: number): T;
    exp(): T;
    ext(rhs: T): T;
    /**
     * extraction of grade.
     */
    grade(grade: number): T;
    lerp(target: T, α: number): T;
    lco(rhs: T): T;
    log(): T;
    mul(rhs: T): T;
    norm(): T;
    pow(exponent: T): T;
    quad(): T;
    rco(rhs: T): T;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    scale(α: number): T;
    scp(rhs: T): T;
    sin(): T;
    sinh(): T;
    slerp(target: T, α: number): T;
    sub(rhs: T): T;
    unitary(): T;
}
export = Measure;
