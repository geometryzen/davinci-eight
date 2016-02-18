import G3m from '../math/G3m';

export default function vector(x: number, y: number, z: number): G3m {
    const v = new G3m();
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}
