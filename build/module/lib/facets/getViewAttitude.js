import { Geometric3 } from '../math/Geometric3';
/**
 * @hidden
 */
var u = Geometric3.zero(false);
/**
 * @hidden
 */
var v = Geometric3.zero(false);
/**
 * @hidden
 */
var n = Geometric3.zero(false);
/**
 * @hidden
 */
var e1 = Geometric3.E1;
/**
 * @hidden
 */
var e2 = Geometric3.E2;
/**
 * @hidden
 */
var e3 = Geometric3.E3;
/**
 * @hidden
 */
export function getViewAttitude(eye, look, up, R) {
    // The attitude is obtained by computing the rotor required to rotate
    // the standard reference frame u, v, n = (e1, e2, e3) to the new reference
    // frame.
    // n = direction(X - look)
    n.copyVector(eye).subVector(look).normalize();
    // u = -(dual(up) >> n) (right contraction turns vector in opposite sense to bivector)
    u.copyVector(up).dual(u).rco(n).neg();
    // v = dual(u ^ n)
    v.copy(u).ext(n).dual(v);
    // We recover the rotor as follows:
    // R = ψ / sqrt(ψ * ~ψ), where ψ = 1 + u * e1 + v * e2 + n * e3
    // We can use e1, e2, e3 as the reciprocal vectors because in an orthogonal
    // frame they are the same as the standard basis vectors.
    // We don't need u, v, w after we recover the rotor, so use them in the
    // intermediate calculation
    R.one().add(u.mul(e1)).add(v.mul(e2)).add(n.mul(e3));
    R.normalize();
}
