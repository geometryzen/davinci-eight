import { isDefined } from "../checks/isDefined";
import { mustSatisfy } from "../checks/mustSatisfy";
import { Vector3 } from "../math/Vector3";
import { VectorE3 } from "../math/VectorE3";

// Assume single-threaded to avoid temporary object creation.
/**
 * @hidden
 */
const n = new Vector3();
/**
 * @hidden
 */
const u = new Vector3();
/**
 * @hidden
 */
const v = new Vector3();

/**
 * @hidden
 */
export function viewArrayFromEyeLookUp(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Float32Array): Float32Array {
    const m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    mustSatisfy("matrix", m.length === 16, () => {
        return "matrix must have length 16";
    });

    n.copy(eye).sub(look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
        // view direction is ambiguous.
        n.z = 1;
    } else {
        n.normalize();
    }

    n.approx(12).normalize();
    u.copy(up).cross(n).approx(12).normalize();
    v.copy(n).cross(u).approx(12).normalize();

    m[0x0] = u.x;
    m[0x4] = u.y;
    m[0x8] = u.z;
    m[0xc] = -Vector3.dot(eye, u);
    m[0x1] = v.x;
    m[0x5] = v.y;
    m[0x9] = v.z;
    m[0xd] = -Vector3.dot(eye, v);
    m[0x2] = n.x;
    m[0x6] = n.y;
    m[0xa] = n.z;
    m[0xe] = -Vector3.dot(eye, n);
    m[0x3] = 0.0;
    m[0x7] = 0.0;
    m[0xb] = 0.0;
    m[0xf] = 1;

    return m;
}
