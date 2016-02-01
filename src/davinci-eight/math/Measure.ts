import Unit from '../math/Unit';
//
// Measure is used to make implementations consistent.
// It is not part of the public API.
// DO NOT USE ANNOTATIONS
// The pseudoscalar is omitted to allow this interface to be used on spinors.
//
interface Measure<T> {
    /**
     * The scalar part of the measure, as a <code>number</code>.
     */
    α: number;
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
    // When the underlying ring is commutative we don't have to specify left or right.
    scale(α: number): T;
    scp(rhs: T): T;
    sin(): T;
    sinh(): T;
    slerp(target: T, α: number): T;
    sub(rhs: T): T;
}

export default Measure;
