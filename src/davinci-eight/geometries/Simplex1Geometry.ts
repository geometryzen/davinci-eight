import SimplexGeometry = require('../geometries/SimplexGeometry')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import R3 = require('../math/R3')
//import VectorN = require('../math/VectorN')

/**
 * @class Simplex1Geometry
 */
class Simplex1Geometry extends SimplexGeometry {
  public head: R3 = new R3([1, 0, 0]);
  public tail: R3 = new R3([0, 1, 0]);
  /**
   * @class Simplex1Geometry
   * @constructor
   */
  constructor() {
    super()
    this.calculate();
  }
  public calculate(): void {
    var pos: R3[] = [0, 1].map(function(index) {return void 0})
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
