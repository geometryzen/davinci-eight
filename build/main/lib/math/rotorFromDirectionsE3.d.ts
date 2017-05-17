import { BivectorE3 as Bivector } from './BivectorE3';
import { VectorE3 as Vector } from './VectorE3';
import { SpinorE3 as Spinor } from './SpinorE3';
/**
 *
 */
export interface MutableSpinor extends Spinor {
    /**
     * Sets this Spinor3 to the geometric product, a * b, of the vector arguments.
     */
    versor(a: Vector, b: Vector): MutableSpinor;
    addScalar(α: number): MutableSpinor;
    divByScalar(α: number): MutableSpinor;
    normalize(): MutableSpinor;
    one(): MutableSpinor;
    rotorFromGeneratorAngle(B: Bivector, θ: number): MutableSpinor;
    zero(): MutableSpinor;
}
/**
 * Sets the output spinor to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * If the vectors are anti-parallel, making the plane of rotation ambiguous,
 * the bivector B will be used if specified.
 * Otherwise, sets the output spinor to a random bivector if the vectors are anti-parallel.
 * The result is independent of the magnitudes of a and b.
 */
export declare function rotorFromDirectionsE3(a: Vector, b: Vector, B: Bivector | undefined, m: MutableSpinor): void;
