import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');

interface Object3D {
  position: Vector3;
  attitude: Spinor3;
  scale: Vector3;
}

export = Object3D;