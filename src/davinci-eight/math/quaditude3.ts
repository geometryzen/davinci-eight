import Cartesian3 = require('../math/Cartesian3')

function quaditude3(vector: Cartesian3): number {
  var x = vector.x
  var y = vector.y
  var z = vector.z
  return x * x + y * y + z * z
}

export = quaditude3