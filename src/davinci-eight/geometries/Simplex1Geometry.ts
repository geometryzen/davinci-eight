import Geometry = require('../geometries/Geometry')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import Vector3 = require('../math/Vector3')
//import VectorN = require('../math/VectorN')

/**
 * @class Simplex1Geometry
 */
class Simplex1Geometry extends Geometry {
  public head: Vector3 = new Vector3([1, 0, 0]);
  public tail: Vector3 = new Vector3([0, 1, 0]);
  /**
   * @class Simplex1Geometry
   * @constructor
   */
  constructor() {
    super()
    this.calculate();
  }
  public calculate(): void {
    var pos: Vector3[] = [0, 1].map(function(index) {return void 0})
    pos[0] = this.tail
    pos[1] = this.head

    function simplex(indices: number[]): Simplex {
      let simplex = new Simplex(indices.length - 1)
      for (var i = 0; i < indices.length; i++) {
        simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]]
      }
      return simplex
    }
    this.data = [[0,1]].map(function(line: number[]) {return simplex(line)})
    // Compute the meta data.
    this.check()
  }
}

export = Simplex1Geometry;
