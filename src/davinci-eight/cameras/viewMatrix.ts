import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');

function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Float32Array): Float32Array {

  let m = isDefined(matrix) ? matrix : new Float32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

  expectArg('m', m).toSatisfy(m instanceof Float32Array, "matrix must be a Float32Array").toSatisfy(m.length === 16, 'matrix must have length 16');

  let n = new Vector3().subVectors(eye, look);
  if (n.x === 0 && n.y === 0 && n.z === 0) {
    // View direction is ambiguous.
    n.z = 1;
  }
  else {
    n.normalize();
  }
  let u = new Vector3().crossVectors(up, n);
  let v = new Vector3().crossVectors(n, u);
  let d = new Vector3([Vector3.dot(eye, u), Vector3.dot(eye, v), Vector3.dot(eye, n)]).multiplyScalar(-1);
  m[0] = u.x;  m[4] = u.y; m[8]  = u.z; m[12] = d.x;
  m[1] = v.x;  m[5] = v.y; m[9]  = v.z; m[13] = d.y;
  m[2] = n.x;  m[6] = n.y; m[10] = n.z; m[14] = d.z;
  m[3] = 0;    m[7] = 0;   m[11] = 0;   m[15] = 1;

  return m;
}

export = viewMatrix;
