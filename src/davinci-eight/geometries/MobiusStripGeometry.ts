import ParametricGeometry = require('../geometries/ParametricGeometry');
import Vector3 = require('../math/Vector3');

let cos = Math.cos;
let sin = Math.sin;
let pi = Math.PI;

function mobius(u: number, v: number): Vector3 {
  /**
   * radius
   */
  var R = 1;
  /**
   * half-width
   */
  var w = 0.05;

  var s = (2 * u - 1) * w; // [-w, w]
  var t = 2 * pi * v;     // [0, 2pi]

  var x = (R + s * cos(t/2)) * cos(t);
  var y = (R + s * cos(t/2)) * sin(t);
  var z = s * sin(t/2);
  return new Vector3(x, y, z);
}

/**
 * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
 */
class MobiusStripGeometry extends ParametricGeometry {
  constructor(uSegments: number, vSegments: number) {
    super(mobius, uSegments, vSegments);
  }
}

export = MobiusStripGeometry;
