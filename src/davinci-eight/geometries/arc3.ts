import VectorE3 = require('../math/VectorE3')
import mustBeDefined = require('../checks/mustBeDefined')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import MutableSpinorE3 = require('../math/MutableSpinorE3')
import SpinorE3 = require('../math/SpinorE3')
import MutableVectorE3 = require('../math/MutableVectorE3')

/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * param begin {VectorE3} The begin position.
 * param angle: {number} The angle of the rotation.
 * param generator {SpinorE3} The generator of the rotation.
 * param segments {number} The number of segments.
 */
function arc3(begin: VectorE3, angle: number, generator: SpinorE3, segments: number): MutableVectorE3[]
{
  mustBeDefined('begin', begin)
  mustBeNumber('angle', angle)
  mustBeDefined('generator', generator)
  mustBeInteger('segments', segments)

  /**
   * The return value is an array of points with length => segments + 1.
   */
  var points: MutableVectorE3[] = []

  /**
   * Temporary point that we will advance for each segment.
   */
  var point = MutableVectorE3.copy(begin)

  /**
   * The rotor that advances us through one segment.
   */
  var rotor = MutableSpinorE3.copy(generator).scale((-angle / 2) / segments).exp()

  points.push(point.clone())

  for (var i = 0; i < segments; i++)
  {
    point.rotate(rotor)
    points.push(point.clone())
  }

  return points
}

export = arc3