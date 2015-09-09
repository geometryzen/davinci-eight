import Face = require('../dfx/Face');
import Vector3 = require('../math/Vector3');

function makeFaceNormalCallback(face: Face): () => number[] {
  return function(): number[] {
    let vA: Vector3 = face.a.position;
    let vB: Vector3 = face.b.position;
    let vC: Vector3 = face.c.position;
    // TODO: rework this so that it does not create any temporary objects, other than the final number[].
    let cb = new Vector3().subVectors(vC, vB);
    let ab = new Vector3().subVectors(vA, vB);
    let normal = new Vector3().crossVectors(cb, ab).normalize();
    return [normal.x, normal.y, normal.z];
  }
}

export = makeFaceNormalCallback;
