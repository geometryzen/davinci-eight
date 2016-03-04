import Geometric3 from '../math/Geometric3'
import IMesh from '../core/IMesh'
import IRigidBody from './IRigidBody'
import R3 from '../math/R3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class IGeometric3RigidBody
 * @extends IMesh
 * @extends IRigidBody
 */
interface IGeometric3RigidBody extends IMesh, IRigidBody<number, Geometric3> {

  /**
   * @property initialAxis
   * @type R3
   */
  initialAxis: R3
}

export default IGeometric3RigidBody
