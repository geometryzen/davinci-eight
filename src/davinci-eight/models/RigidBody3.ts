import IRigidBody3 = require('../models/IRigidBody3')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import Spinor3 = require('../math/Spinor3')
import Vector3 = require('../math/Vector3')
import Cartesian3 = require('../math/Cartesian3');

// The `type` property when this class is being used concretely.
let TYPE_RIGID_BODY_3 = 'RigidBody3';

/**
 * A model for a rigid body in 3-dimensional space.
 * This class may be used concretely or extended.
 * @class RigidBody3
 */
class RigidBody3 extends Shareable implements IRigidBody3 {
  private _attitude: Spinor3;
  private _position: Vector3;
  /**
   * The `attitude` is initialized to the default for `Spinor3`.
   * The `position` is initialized to the default for `Vector3`.
   * This class assumes that it is being used concretely if the type is 'RigidBody3'.
   * @class RigidBody3
   * @constructor
   * @param type {string} The class name of the derived class. Defaults to 'RigidBody3'.
   */
  constructor(type: string = 'RigidBody3') {
    super(type)
    this._attitude = new Spinor3()
    this._position = new Vector3()
  }
  protected destructor(): void {
    if (this._type !== TYPE_RIGID_BODY_3) {
      console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
    }
    this._attitude = void 0
    this._position = void 0
  }
  /**
   * The attitude spinor of the rigid body.
   * @property attitude
   * @type Spinor3
   * @readonly
   */
  get attitude(): Spinor3 {
    return this._attitude
  }
  set attitude(unused) {
    throw new Error(readOnly('attitude').message)
  }
  /**
   * The position vector of the rigid body.
   * @property position
   * @type Vector3
   * @readonly
   */
  get position(): Vector3 {
    return this._position
  }
  set position(unused) {
    throw new Error(readOnly('position').message)
  }
}

export = RigidBody3