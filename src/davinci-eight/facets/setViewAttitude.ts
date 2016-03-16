import Geometric3 from '../math/Geometric3'
import R3 from '../math/R3'
import SpinorE3 from '../math/SpinorE3'

const u: Geometric3 = Geometric3.zero()
const v: Geometric3 = Geometric3.zero()
const n: Geometric3 = Geometric3.zero()

export default function(R: SpinorE3, eye: Geometric3, look: Geometric3, up: Geometric3) {
  // Changing the attitude changes the position (The converse is also true).
  // We keep the look point and the distance to the look point invariant.
  // We also leave the up vector unchanged.
  const d = look.distanceTo(eye)
  u.copyVector(R3.e1).rotate(R)
  v.copyVector(R3.e2).rotate(R)
  n.copyVector(R3.e3).rotate(R)
  eye.copyVector(look).add(n, d)
}
