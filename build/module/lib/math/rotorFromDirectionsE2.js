import { dotVectorE2 } from './dotVectorE2';
import { quadVectorE2 } from './quadVectorE2';
var sqrt = Math.sqrt;
/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 */
export function rotorFromDirectionsE2(a, b, m) {
    var quadA = quadVectorE2(a);
    var absA = sqrt(quadA);
    var quadB = quadVectorE2(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var dotBA = dotVectorE2(b, a);
    var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
    if (denom !== 0) {
        m = m.versor(b, a);
        m = m.addScalar(BA);
        m = m.divByScalar(denom);
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        return void 0;
    }
}
