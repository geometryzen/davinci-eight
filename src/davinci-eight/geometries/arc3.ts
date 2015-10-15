import Cartesian3 = require('../math/Cartesian3')
import mustBeDefined = require('../checks/mustBeDefined')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import Spinor3 = require('../math/Spinor3')
import Spinor3Coords = require('../math/Spinor3Coords')
import Vector3 = require('../math/Vector3')

/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * param begin {Cartesian3} The begin position.
 * param angle: {number} The angle of the rotation.
 * param generator {Spinor3Coords} The generator of the rotation.
 * param segments {number} The number of segments.
 */
function arc3(begin: Cartesian3, angle: number, generator: Spinor3Coords, segments: number): Vector3[]
{
  mustBeDefined('begin', begin)
  mustBeNumber('angle', angle)
  mustBeDefined('generator', generator)
  mustBeInteger('segments', segments)

  /**
   * The return value is an array of points with length => segments + 1.
   */
  var points: Vector3[] = []

  /**
   * Temporary point that we will advance for each segment.
   */
  var point = Vector3.copy(begin)

  /**
   * The rotor that advances us through one segment.
   */
  var rotor = Spinor3.copy(generator).scale((-angle / 2) / segments).exp()

  points.push(point.clone())

  for (var i = 0; i < segments; i++)
  {
    point.rotate(rotor)
    points.push(point.clone())
  }

  return points
}

export = arc3