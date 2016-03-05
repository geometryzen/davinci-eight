import Geometric3 from '../math/Geometric3'
import AbstractMesh from '../core/AbstractMesh'
import IRigidBody from './IRigidBody'
import R3 from '../math/R3'

/**
 * Intentionally undocumented.
 */
interface IGeometric3RigidBody extends AbstractMesh, IRigidBody<number, Geometric3> {
  initialAxis: R3
}

export default IGeometric3RigidBody
