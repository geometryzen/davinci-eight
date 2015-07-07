import Quaternion = require('../math/Quaternion');
import RevolutionGeometry = require('../geometries/RevolutionGeometry');
import Vector3 = require('../math/Vector3');

class ArrowGeometry extends RevolutionGeometry {
  constructor(scale: number, attitude: Quaternion, segments: number, length: number, radiusShaft: number, radiusCone: number, lengthCone: number, axis: { x: number; y: number; z: number }) {
    scale        = scale || 1;
    attitude     = attitude || new Quaternion(0, 0, 0, 1);
    length       = (length || 1) * scale;
    radiusShaft  = (radiusShaft || 0.01) * scale;
    radiusCone   = (radiusCone  || 0.08) * scale;
    lengthCone   = (lengthCone  || 0.20) * scale;
    axis         = axis || new Vector3(0, 0, 1);
    var lengthShaft = length - lengthCone;
    var halfLength = length / 2;
    var permutation = function(direction) {
      if (direction.x) {
        return 2;
      }
      else if (direction.y) {
        return 1;
      }
      else {
        return 0;
      }
    };
    var orientation = function(direction) {
      if (direction.x > 0) {
        return +1;
      }
      else if (direction.x < 0) {
        return -1;
      }
      else if (direction.y > 0) {
        return +1;
      }
      else if (direction.y < 0) {
        return -1;
      }
      else if (direction.z > 0) {
        return +1;
      }
      else if (direction.z < 0) {
        return -1;
      }
      else {
        return 0;
      }
    }
    var computeArrow = function (direction) {
      var cycle = permutation(direction);
      var sign  = orientation(direction);
      var i = (cycle + 0) % 3;
      var j = (cycle + 1) % 3;
      var k = (cycle + 2) % 3;
      var shL = halfLength * sign;
      var data = [
        [0,           0, halfLength * sign],
        [radiusCone,  0, (lengthShaft - halfLength) * sign],
        [radiusShaft, 0, (lengthShaft - halfLength) * sign],
        [radiusShaft, 0, (-halfLength) * sign],
        [0,           0, (-halfLength) * sign]
      ];
      var points = data.map(function(point) {return new Vector3(point[i], point[j], point[k])});
      var generator = new Quaternion(direction.x, direction.y, direction.z, 0);
      return {"points": points, "generator": generator};
    };
    var arrow = computeArrow(axis);
    super(arrow.points, arrow.generator, segments, 0, 2 * Math.PI, attitude);
  }
}

export = ArrowGeometry;
