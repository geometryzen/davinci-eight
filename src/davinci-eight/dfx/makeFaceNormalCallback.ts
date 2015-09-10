import Face = require('../dfx/Face');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');

/**
 * This only works if the position property has dimensionality 3.
 */
function makeFaceNormalCallback(face: Face): () => number[] {
  return function(): number[] {
    // TODO: rework this so that it does not create any temporary objects, other than the final number[].
    let vA: Vector3 = new Vector3(face.a.position.data);
    let vB: Vector3 = new Vector3(face.b.position.data);
    let vC: Vector3 = new Vector3(face.c.position.data);
    let cb = new Vector3().subVectors(vC, vB);
    let ab = new Vector3().subVectors(vA, vB);
    let normal = new Vector3().crossVectors(cb, ab).normalize();
    return [normal.x, normal.y, normal.z];
  }
}

export = makeFaceNormalCallback;
