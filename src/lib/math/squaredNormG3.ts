import { GeometricE3 } from '../math/GeometricE3';

export function squaredNormG3(m: GeometricE3) {
    const a = m.a;
    const x = m.x;
    const y = m.y;
    const z = m.z;
    const yz = m.yz;
    const zx = m.zx;
    const xy = m.xy;
    const b = m.b;
    return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
}
