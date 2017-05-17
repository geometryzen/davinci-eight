import { Geometric3 } from '../math/Geometric3';
import { Vector3 } from '../math/Vector3';
var u = Geometric3.zero(false);
var v = Geometric3.zero(false);
var n = Geometric3.zero(false);
var e1 = Vector3.vector(1, 0, 0);
var e2 = Vector3.vector(0, 1, 0);
var e3 = Vector3.vector(0, 0, 1);
export function setViewAttitude(R, eye, look, up) {
    // Changing the attitude changes the position (The converse is also true).
    // We keep the look point and the distance to the look point invariant.
    // We also leave the up vector unchanged.
    var d = look.distanceTo(eye);
    u.copyVector(e1).rotate(R);
    v.copyVector(e2).rotate(R);
    n.copyVector(e3).rotate(R);
    eye.copyVector(look).add(n, d);
}
