import { dotVectorE3 as dot } from './dotVectorE3';
import { quadVectorE3 as quad } from './quadVectorE3';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';
var sqrt = Math.sqrt;
var cosPIdiv4 = Math.cos(Math.PI / 4);
var sinPIdiv4 = Math.sin(Math.PI / 4);
/**
 * Sets the output spinor to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * If the vectors are anti-parallel, making the plane of rotation ambiguous,
 * the bivector B will be used if specified.
 * Otherwise, sets the output spinor to a random bivector if the vectors are anti-parallel.
 * The result is independent of the magnitudes of a and b.
 */
export function rotorFromDirectionsE3(a, b, B, m) {
    // Optimization for equal vectors.
    if (a.x === b.x && a.y === b.y && a.z === b.z) {
        // An easy optimization is simply to compare the vectors for equality.
        m.one();
        return;
    }
    // Optimizations for cardinal directions.
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
        // e1 to e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = -sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // e1 to e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
        // e2 to e1
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // e2 to e3
        m.zero();
        m.a = cosPIdiv4;
        m.yz = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 1 && b.y === 0 && b.z === 0) {
        // e3 to e1
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 1 && b.z === 0) {
        // e3 to e2
        m.zero();
        m.a = cosPIdiv4;
        m.yz = sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
        // e1 to -e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
        // e1 to -e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
        // e2 to -e1
        m.zero();
        m.a = cosPIdiv4;
        m.xy = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
        // e2 to -e3
        m.zero();
        m.a = cosPIdiv4;
        m.yz = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === -1 && b.y === 0 && b.z === 0) {
        // e3 to -e1
        m.zero();
        m.a = cosPIdiv4;
        m.zx = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === -1 && b.z === 0) {
        // e3 to -e2
        m.zero();
        m.a = cosPIdiv4;
        m.yz = -sinPIdiv4;
        return;
    }
    if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
        // -e1 to +e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // -e1 to +e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    // Optimizations when the plane of rotation is ambiguous and a default bivector is not defined.
    if (typeof B === 'undefined') {
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
            // +e1 to -e1.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
            // -e1 to +e1.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
            // +e2 to -e2.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === -1 && a.z === 0 && b.x === 0 && b.y === +1 && b.z === 0) {
            // -e2 to +e2.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 0 && b.z === -1) {
            // +e3 to -e3.
            m.zero();
            m.zx = -1;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === -1 && b.x === 0 && b.y === 0 && b.z === +1) {
            // -e3 to +e3.
            m.zero();
            m.zx = -1;
            return;
        }
    }
    var quadA = quad(a);
    var absA = sqrt(quadA);
    var quadB = quad(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var dotBA = dot(b, a);
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
        // Compute a random bivector containing the start vector, then turn
        // it into a rotor that achieves the 180-degree rotation.
        if (B) {
            m.rotorFromGeneratorAngle(B, Math.PI);
        }
        else {
            var rx = Math.random();
            var ry = Math.random();
            var rz = Math.random();
            m.zero();
            m.yz = wedgeYZ(rx, ry, rz, a.x, a.y, a.z);
            m.zx = wedgeZX(rx, ry, rz, a.x, a.y, a.z);
            m.xy = wedgeXY(rx, ry, rz, a.x, a.y, a.z);
            m.normalize();
            m.rotorFromGeneratorAngle(m, Math.PI);
        }
    }
}
