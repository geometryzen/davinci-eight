import PolyhedronSimplexGeometry = require('../geometries/PolyhedronSimplexGeometry');

var vertices = [
   1,  1,  1,   - 1, - 1,  1,   - 1,  1, - 1,    1, - 1, - 1
];

var indices = [
   2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1
];

/**
 * @class TetrahedronSimplexGeometry
 * @extends PolyhedronSimplexGeometry
 */
class TetrahedronSimplexGeometry extends PolyhedronSimplexGeometry {
  /**
   * @class TetrahedronSimplexGeometry
   * @constructor
   * @param radius [number]
   * @param detail [number]
   */
  constructor(radius?: number, detail?: number) {
    super(vertices, indices, radius, detail)
  }
}

export = TetrahedronSimplexGeometry;
