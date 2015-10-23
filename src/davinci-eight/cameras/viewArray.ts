import VectorE3 = require('../math/VectorE3');
import MutableVectorE3 = require('../math/MutableVectorE3');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');

function viewArray(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Float32Array): Float32Array {

    let m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    expectArg('matrix', m).toSatisfy(m.length === 16, 'matrix must have length 16');

    let n = new MutableVectorE3().sub2(eye, look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
        // View direction is ambiguous.
        n.z = 1;
    }
    else {
        n.normalize();
    }
    let u = new MutableVectorE3().cross2(up, n);
    let v = new MutableVectorE3().cross2(n, u);
    let d = new MutableVectorE3([MutableVectorE3.dot(eye, u), MutableVectorE3.dot(eye, v), MutableVectorE3.dot(eye, n)]).scale(-1);
    m[0] = u.x; m[4] = u.y; m[8] = u.z; m[12] = d.x;
    m[1] = v.x; m[5] = v.y; m[9] = v.z; m[13] = d.y;
    m[2] = n.x; m[6] = n.y; m[10] = n.z; m[14] = d.z;
    m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;

    return m;
}

export = viewArray;
