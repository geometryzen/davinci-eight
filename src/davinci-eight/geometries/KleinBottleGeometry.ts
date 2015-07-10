import ParametricGeometry = require('../geometries/ParametricGeometry');
import Vector3 = require('../math/Vector3');

let cos = Math.cos;
let sin = Math.sin;
let pi = Math.PI;

function klein(u: number, v: number): Vector3 {
  var x: number;
  var y: number;
  var z: number;

  u = u * 2 * pi;
  v = v * 2 * pi;

  if (u < pi) {
    x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v)
    z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v)
  }
  else {
    x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi)
    z = -8 * sin(u)
  }
  y = -2 * (1 - cos(u) / 2) * sin(v)
  return new Vector3(x, y, z);
}

/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 * @class KleinBottleGeometry
 * @extends ParametricGeometry
 */
class KleinBottleGeometry extends ParametricGeometry {
  /**
   * @class KleinBottleGeometry
   * @constructor
   * @param uSegments {number}
   * @param vSegments {number}
   */
  constructor(uSegments: number, vSegments: number) {
    super(klein, uSegments, vSegments);
  }
}

export = KleinBottleGeometry;
