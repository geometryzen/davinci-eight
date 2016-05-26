import {Geometric3} from '../math/Geometric3';

export default function vector(x: number, y: number, z: number): Geometric3 {
    const v = new Geometric3();
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}
