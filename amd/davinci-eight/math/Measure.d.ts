import Unit = require('../math/Unit');
interface Measure<T> {
    coordinates(): number[];
    uom: Unit;
    add(rhs: T): T;
    sub(rhs: T): T;
    mul(rhs: T): T;
    div(rhs: T): T;
    wedge(rhs: T): T;
    conL(rhs: T): T;
    conR(rhs: T): T;
    pow(exponent: T): T;
    cos(): T;
    cosh(): T;
    exp(): T;
    /**
     * The squared norm is defined to be align(A, reverse(A)), or ||A|| = sqrt(align(A, reverse(A))) (Dorst p67)
     */
    norm(): T;
    quad(): T;
    sin(): T;
    sinh(): T;
    unitary(): T;
    gradeZero(): number;
    align(rhs: T): T;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
}
export = Measure;
