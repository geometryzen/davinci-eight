import Curve from '../curves/Curve';
import {G3} from '../math/G3';

export default class QuadraticBezierCurve extends Curve {
    beginPoint: G3;
    controlPoint: G3;
    endPoint: G3;
    constructor(beginPoint: G3, controlPoint: G3, endPoint: G3) {
        super()
        this.beginPoint = beginPoint
        this.controlPoint = controlPoint
        this.endPoint = endPoint
    }
    getPoint(t: number): G3 {
        return this.beginPoint.quadraticBezier(t, this.controlPoint, this.endPoint)
    }
}
