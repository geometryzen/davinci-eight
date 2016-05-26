import Curve from '../curves/Curve';
import {G3} from '../math/G3';

export default class LineCurve extends Curve {
    v1: G3;
    v2: G3;
    constructor(v1: G3, v2: G3) {
        super()
        this.v1 = v1
        this.v2 = v2
    }
    getPoint(t: number): G3 {
        return this.v1.lerp(this.v2, t)
    }
}
