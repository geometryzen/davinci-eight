import Curve = require('../curves/Curve');
import Euclidean3 = require('../math/Euclidean3');
declare class CubicBezierCurve extends Curve {
    beginPoint: Euclidean3;
    controlBegin: Euclidean3;
    controlEnd: Euclidean3;
    endPoint: Euclidean3;
    constructor(beginPoint: Euclidean3, controlBegin: Euclidean3, controlEnd: Euclidean3, endPoint: Euclidean3);
    getPoint(t: number): Euclidean3;
}
export = CubicBezierCurve;
