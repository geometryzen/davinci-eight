import Curve from '../curves/Curve';
import {G3} from '../math/G3';

export default class CubicBezierCurve extends Curve {
    beginPoint: G3;
    controlBegin: G3;
    controlEnd: G3;
    endPoint: G3;
    constructor(beginPoint: G3, controlBegin: G3, controlEnd: G3, endPoint: G3) {
        super()
        this.beginPoint = beginPoint
        this.controlBegin = controlBegin
        this.controlEnd = controlEnd
        this.endPoint = endPoint
    }
    getPoint(t: number): G3 {
        return this.beginPoint.cubicBezier(t, this.controlBegin, this.controlEnd, this.endPoint)
    }
}
