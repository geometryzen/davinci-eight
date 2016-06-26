import GeometricE3 from '../math/GeometricE3';

export default function squaredNormG3(m: GeometricE3) {
    let w = m.a;
    let x = m.x;
    let y = m.y;
    let z = m.z;
    let yz = m.yz;
    let zx = m.zx;
    let xy = m.xy;
    let v = m.b;
    return w * w + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + v * v;
}
