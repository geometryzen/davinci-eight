import PolyhedronGeometry = require('../geometries/PolyhedronGeometry');

var vertices = [
   1,  1,  1,   - 1, - 1,  1,   - 1,  1, - 1,    1, - 1, - 1
];

var indices = [
   2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1
];

class TetrahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number) {
    super(vertices, indices, radius, detail);
  }
}

export = TetrahedronGeometry;
