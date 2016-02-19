import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';
import mustSatisfy from '../checks/mustSatisfy';
import isDefined from '../checks/isDefined';

// Assume single-threaded to avoid temporary object creation.
const n = new Vector3()
const u = new Vector3()
const v = new Vector3()

export default function viewArray(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Float32Array): Float32Array {

    const m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    mustSatisfy('matrix', m.length === 16, () => { return 'matrix must have length 16' });

    n.copy(eye).sub(look)
    if (n.x === 0 && n.y === 0 && n.z === 0) {
        // View direction is ambiguous.
        n.z = 1;
    }
    else {
        n.direction();
    }
    u.copy(up).cross(n)
    v.copy(n).cross(u)
    m[0x0] = u.x; m[0x4] = u.y; m[0x8] = u.z; m[0xC] = -Vector3.dot(eye, u);
    m[0x1] = v.x; m[0x5] = v.y; m[0x9] = v.z; m[0xD] = -Vector3.dot(eye, v);
    m[0x2] = n.x; m[0x6] = n.y; m[0xA] = n.z; m[0xE] = -Vector3.dot(eye, n);
    m[0x3] = 0;   m[0x7] = 0;   m[0xB] = 0;   m[0xF] = 1;

    return m;
}
