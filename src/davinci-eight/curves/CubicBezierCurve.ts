import Curve from '../curves/Curve';
import Euclidean3 from '../math/Euclidean3';

export default class CubicBezierCurve extends Curve {
    beginPoint: Euclidean3;
    controlBegin: Euclidean3;
    controlEnd: Euclidean3;
    endPoint: Euclidean3;
    constructor(beginPoint: Euclidean3, controlBegin: Euclidean3, controlEnd: Euclidean3, endPoint: Euclidean3) {
        super()
        this.beginPoint = beginPoint
        this.controlBegin = controlBegin
        this.controlEnd = controlEnd
        this.endPoint = endPoint
    }
    getPoint(t: number): Euclidean3 {
        return this.beginPoint.cubicBezier(t, this.controlBegin, this.controlEnd, this.endPoint)
    }
}
