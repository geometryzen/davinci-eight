import Curve = require('../curves/Curve');
import Euclidean3 = require('../math/Euclidean3');
declare class QuadraticBezierCurve extends Curve {
    beginPoint: Euclidean3;
    controlPoint: Euclidean3;
    endPoint: Euclidean3;
    constructor(beginPoint: Euclidean3, controlPoint: Euclidean3, endPoint: Euclidean3);
    getPoint(t: number): Euclidean3;
}
export = QuadraticBezierCurve;
