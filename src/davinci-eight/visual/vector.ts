import G3 from '../math/G3';

export default function vector(x: number, y: number, z: number): G3 {
    const v = new G3();
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}
