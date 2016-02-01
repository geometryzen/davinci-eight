import Curve from '../curves/Curve';
import Euclidean3 from '../math/Euclidean3';

// Catmull-Rom
/*
function interpolate(p0, p1, p2, p3, t) {

    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    var t2 = t * t;
    var t3 = t * t2;
    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

}
*/

function interpolate(p0: Euclidean3, p1: Euclidean3, p2: Euclidean3, p3: Euclidean3, t: number): Euclidean3 {
    var v20 = p2.sub(p0)
    var v12 = p1.sub(p2)
    var v21 = p2.sub(p1)
    var v31 = p3.sub(p1)
    var t12 = v12.scale(2)
    var hv20 = v20.scale(0.5)
    var hv31 = v31.scale(0.5);
    var t2 = t * t;
    var t3 = t * t2;
    var b3 = t12.add(hv20).add(hv31).scale(t3)
    var b2 = p2.scale(3).sub(p1.scale(3)).sub(v20).sub(hv31).scale(t2)
    var b1 = hv20.scale(t)
    return b3.add(b2).add(b1).add(p1);

}

/**
 * @class SplineCurve
 */
export default class SplineCurve extends Curve {
    points: Euclidean3[]
    /**
     * @class SplineCurve
     * @constructor
     */
    constructor(points: Euclidean3[] = []) {
        super()
        this.points = points
    }
    /**
     * @method getPoint
     * @param t {number}
     * @return {Euclidean3}
     */
    getPoint(t: number): Euclidean3 {

        var points = this.points;
        var point = (points.length - 1) * t;

        var intPoint = Math.floor(point);
        var weight = point - intPoint;

        var point0 = points[intPoint == 0 ? intPoint : intPoint - 1];
        var point1 = points[intPoint];
        var point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
        var point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];

        return interpolate(point0, point1, point2, point3, weight);
    }

}
