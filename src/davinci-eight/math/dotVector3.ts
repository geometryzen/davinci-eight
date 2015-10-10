import Cartesian3 = require('../math/Cartesian3')

function dotVector3(a: Cartesian3, b: Cartesian3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export = dotVector3