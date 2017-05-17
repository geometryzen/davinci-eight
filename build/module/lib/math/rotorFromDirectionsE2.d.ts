import { VectorE2 } from './VectorE2';
import { SpinorE2 } from './SpinorE2';
export interface Output extends SpinorE2 {
    versor(a: VectorE2, b: VectorE2): Output;
    addScalar(α: number): Output;
    divByScalar(α: number): Output;
}
/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 */
export declare function rotorFromDirectionsE2(a: VectorE2, b: VectorE2, m: Output): void;
