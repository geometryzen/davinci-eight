import { Geometric3 } from "../math/Geometric3";
import { SpinorE3 } from "../math/SpinorE3";
import { Vector3 } from "../math/Vector3";

/**
 * @hidden
 */
const u: Geometric3 = Geometric3.zero(false);
/**
 * @hidden
 */
const v: Geometric3 = Geometric3.zero(false);
/**
 * @hidden
 */
const n: Geometric3 = Geometric3.zero(false);

/**
 * @hidden
 */
const e1 = Vector3.vector(1, 0, 0);
/**
 * @hidden
 */
const e2 = Vector3.vector(0, 1, 0);
/**
 * @hidden
 */
const e3 = Vector3.vector(0, 0, 1);

/**
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setViewAttitude(R: SpinorE3, eye: Geometric3, look: Geometric3, up: Geometric3) {
    // Changing the attitude changes the position (The converse is also true).
    // We keep the look point and the distance to the look point invariant.
    // We also leave the up vector unchanged.
    const d = look.distanceTo(eye);
    u.copyVector(e1).rotate(R);
    v.copyVector(e2).rotate(R);
    n.copyVector(e3).rotate(R);
    eye.copyVector(look).add(n, d);
}
