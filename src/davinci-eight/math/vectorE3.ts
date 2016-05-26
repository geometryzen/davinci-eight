import {G3} from '../math/G3';
import {Unit} from '../math/Unit';

export default function vectorE3(x: number, y: number, z: number, uom?: Unit): G3 {
    return new G3(0, x, y, z, 0, 0, 0, 0, uom);
}
