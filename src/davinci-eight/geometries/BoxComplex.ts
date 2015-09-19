import buildPlane = require('../geometries/buildPlane');
import Complex = require('../dfx/Complex');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeNumber = require('../checks/mustBeNumber');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

function boxCtor() {
  return "BoxComplex constructor";
}

/**
 * @class BoxComplex
 * @extends Complex
 */
class BoxComplex extends Complex {
  constructor(x: number = 1, y: number = 1, z: number = 1,
    xSeg: number = 1, ySeg: number = 1, zSeg: number = 1,
    wireFrame: boolean = false) {

    super();

    mustBeNumber('x', x, boxCtor);
    mustBeNumber('y', y, boxCtor);
    mustBeNumber('z', z, boxCtor);
    mustBeInteger('xSeg', xSeg, boxCtor);
    mustBeInteger('ySeg', ySeg, boxCtor);
    mustBeInteger('zSeg', zSeg, boxCtor);

    // Temporary storage for points.
    // The approach is:
    // 1. Compute the points first.
    // 2. Compute the faces and have them reference the points.
    // 3. Throw away the temporary storage of points. 
    let points: Vector3[] = [];

    let faces: Simplex[] = this.data;

    let xdiv2 = x / 2;
    let ydiv2 = y / 2;
    let zdiv2 = z / 2;

    // FIXME: Possible bug in 4th column? Not symmetric.
    buildPlane('z', 'y', -1, -1, z, y, +xdiv2, xSeg, ySeg, zSeg, new Vector1([0]), points, faces); // +x
    buildPlane('z', 'y', +1, -1, z, y, -xdiv2, xSeg, ySeg, zSeg, new Vector1([1]), points, faces); // -x
    buildPlane('x', 'z', +1, +1, x, z, +ydiv2, xSeg, ySeg, zSeg, new Vector1([2]), points, faces); // +y
    buildPlane('x', 'z', +1, -1, x, z, -ydiv2, xSeg, ySeg, zSeg, new Vector1([3]), points, faces); // -y
    buildPlane('x', 'y', +1, -1, x, y, +zdiv2, xSeg, ySeg, zSeg, new Vector1([4]), points, faces); // +z
    buildPlane('x', 'y', -1, -1, x, y, -zdiv2, xSeg, ySeg, zSeg, new Vector1([5]), points, faces); // -z

    if (wireFrame) {
      this.boundary();
    }
    // This construction duplicates vertices along the edges of the cube.
    this.mergeVertices();
    this.check();
  }
}

export = BoxComplex;
