import Curve from '../curves/Curve';
import Euclidean3 from '../math/Euclidean3';

export default class LineCurve extends Curve {
    v1: Euclidean3;
    v2: Euclidean3;
    constructor(v1: Euclidean3, v2: Euclidean3) {
        super()
        this.v1 = v1
        this.v2 = v2
    }
    getPoint(t: number): Euclidean3 {
        return this.v1.lerp(this.v2, t)
    }
}
