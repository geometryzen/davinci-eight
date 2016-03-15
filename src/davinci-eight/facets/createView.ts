import FacetVisitor from '../core/FacetVisitor';
import Geometric3 from '../math/Geometric3';
import G3 from '../math/G3';
import R3 from '../math/R3';
import SpinorE3 from '../math/SpinorE3';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import View from './View';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import isUndefined from '../checks/isUndefined';
import viewMatrixFromEyeLookUp from './viewMatrixFromEyeLookUp';
import readOnly from '../i18n/readOnly';

// Scratch variables for the view reference frame.
const u: Geometric3 = Geometric3.zero()
const v: Geometric3 = Geometric3.zero()
const n: Geometric3 = Geometric3.zero()
// Scratch variable for the attitude.
const R: Geometric3 = Geometric3.one()

const e1: Geometric3 = Geometric3.fromVector(R3.e1)
const e2: Geometric3 = Geometric3.fromVector(R3.e2)
const e3: Geometric3 = Geometric3.fromVector(R3.e3)

//
// In this implementation, the state variables are eye, look, and up.
//
// This is equivalent to specifying position and attitude by the following correspondence:
//
// eye is exactly equivalent to position.
//
// look and eye taken together define a unit vector, n, which points in the opposite direction of viewing.
// n and up allow us to calculate the unit vector v which is in the plane of n and up,
// orthogonal to n and on the same side as up.
// n and v define a third unit vector u, where u x v = n.
// This orthogonal frame u, v, n is equivalent to an attitude in that the attitude is the rotor that
// transforms from the reference frame to the u, v, n frame.
// The reference frame is n = e3, v = e2, and u = e1.
//
export default function createView(options: { viewMatrixName?: string } = {}): View {

  /**
   * eye is the position vector of the viewing point.
   * Default is e3.
   */
  const X: Vector3 = Vector3.copy(G3.e3)

  /**
   * look is the point that we are looking at.
   * Default is 0, the origin.
   */
  const look: Vector3 = Vector3.copy(G3.zero)

  /**
   * up is the "guess" at where up should be.
   * Default is e2.
   */
  const up: Vector3 = Vector3.copy(G3.e2)

  /**
   *
   */
  const viewMatrix: Matrix4 = Matrix4.one()
  const viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName

  // Force an update of the view matrix.
  X.modified = true
  look.modified = true
  up.modified = true

  const self: View = {
    setProperty(name: string, value: number[]): View {
      return self
    },
    getAttitude(): SpinorE3 {
      // The attitude is obtained by computing the rotor required to rotate
      // the standard reference frame u, v, n = (e1, e2, e3) to the new reference
      // frame.
      // n = direction(X - look)
      n.copyVector(X).subVector(look).normalize()
      // u = -(dual(up) >> n) (right contraction turns vector in opposite sense to bivector)
      u.copyVector(up).dual(u).rco(n).neg()
      // v = dual(u ^ n)
      v.copy(u).ext(n).dual(v)
      // We recover the rotor as follows:
      // R = ψ / sqrt(ψ * ~ψ), where ψ = 1 + u * e1 + v * e2 + n * e3
      // We can use e1, e2, e3 as the reciprocal vectors because in an orthogonal
      // frame they are the same as the standard basis vectors.
      // We don't need u, v, w after we recover the rotor, so use them in the
      // intermediate calculation
      R.one().add(u.mul(e1)).add(v.mul(e2)).add(n.mul(e3))
      R.normalize()
      return R
    },
    setAttitude(attitude: SpinorE3): void {
      // Changing the attitude changes the position (The converse is also true).
      // We keep the look point and the distance to the look point invariant.
      // We also leave the up vector unchanged.
      const d = look.distanceTo(X)
      R.copySpinor(attitude)
      u.copy(e1).rotate(R)
      v.copy(e2).rotate(R)
      n.copy(e3).rotate(R)
      X.copy(look).add(n, d)
    },
    getPosition(): VectorE3 {
      return X
    },
    setPosition(position: VectorE3) {
      X.copy(position)
    },
    get eye(): Vector3 {
      return X
    },
    set eye(value: Vector3) {
      self.setEye(value)
    },
    setEye(eye_: Vector3): View {
      mustBeObject('eye', eye_)
      X.x = mustBeNumber('eye.x', eye_.x)
      X.y = mustBeNumber('eye.y', eye_.y)
      X.z = mustBeNumber('eye.z', eye_.z)
      return self
    },
    get look(): Vector3 {
      return look
    },
    set look(value: Vector3) {
      self.setLook(value)
    },
    setLook(value: VectorE3): View {
      mustBeObject('look', value)
      look.x = value.x
      look.y = value.y
      look.z = value.z
      return self
    },
    get up(): Vector3 {
      return up
    },
    set up(value: Vector3) {
      self.setUp(value)
    },
    setUp(value: VectorE3): View {
      mustBeObject('up', value)
      up.x = value.x
      up.y = value.y
      up.z = value.z
      up.normalize()
      return self
    },
    get viewMatrix(): Matrix4 {
      return viewMatrix
    },
    set viewMatrix(unused: Matrix4) {
      throw new Error(readOnly('viewMatrix').message)
    },
    setUniforms(visitor: FacetVisitor): void {
      if (X.modified || look.modified || up.modified) {
        viewMatrixFromEyeLookUp(X, look, up, viewMatrix)
        X.modified = false
        look.modified = false
        up.modified = false
      }
      visitor.mat4(viewMatrixName, viewMatrix, false)
    }
  }
  return self
}
