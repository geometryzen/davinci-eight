import Euclidean3 from '../math/Euclidean3';
import Unit from '../math/Unit';

export default function vectorE3(x: number, y: number, z: number, uom?: Unit): Euclidean3 {
    return new Euclidean3(0, x, y, z, 0, 0, 0, 0, uom);
}
