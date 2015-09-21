import IUnknown = require('../core/IUnknown')
import Spinor3 = require('../math/Spinor3')
import Vector3 = require('../math/Vector3')

interface IRigidBody3 extends IUnknown {
  position: Vector3;
  attitude: Spinor3;
}

export = IRigidBody3