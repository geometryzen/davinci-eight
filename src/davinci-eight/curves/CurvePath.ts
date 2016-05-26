import Curve from '../curves/Curve';
import {G3} from '../math/G3';
import LineCurve from '../curves/LineCurve';

export default class CurvePath extends Curve {
    public curves: Curve[];
    // bends;
    autoClose: boolean;
    cacheLengths: number[]
    constructor() {
        super()
        this.curves = [];
        // this.bends = [];

        this.autoClose = false; // Automatically closes the path
    }
    add(curve: Curve): number {
        return this.curves.push(curve)
    }
    checkConnection() {
        // TODO
        // If the ending of curve is not connected to the starting
        // or the next curve, then, this is not a real path
    }
    closePath() {
        // TODO Test
        // and verify for vector3 (needs to implement equals)
        // Add a line curve if start and end of lines are not connected
        var startPoint = this.curves[0].getPoint(0);
        var endPoint = this.curves[this.curves.length - 1].getPoint(1);

        if (!startPoint.equals(endPoint)) {
            this.curves.push(new LineCurve(endPoint, startPoint));
        }
    }

    // To get accurate point with reference to
    // entire path distance at time t,
    // following has to be done:

    // 1. Length of each sub path have to be known
    // 2. Locate and identify type of curve
    // 3. Get t for the curve
    // 4. Return curve.getPointAt(t')

    getPoint(t: number): G3 {

        var d = t * this.getLength();
        var curveLengths = this.getCurveLengths();
        var i = 0
        var diff: number;
        var curve: Curve;

        // To think about boundaries points.

        while (i < curveLengths.length) {

            if (curveLengths[i] >= d) {

                diff = curveLengths[i] - d;
                curve = this.curves[i];

                var u = 1 - diff / curve.getLength();

                return curve.getPointAt(u);

            }

            i++;

        }

        return null;

        // loop where sum != 0, sum > d , sum+1 <d

    }
    // We cannot use the default Curve getPoint() with getLength() because in
    // Curve, getLength() depends on getPoint() but in CurvePath
    // getPoint() depends on getLength

    getLength() {
        var lens = this.getCurveLengths();
        return lens[lens.length - 1];
    }

    // Compute lengths and cache them
    // We cannot overwrite getLengths() because UtoT mapping uses it.
    getCurveLengths(): number[] {

        // We use cache values if curves and cache array are same length
        if (this.cacheLengths && this.cacheLengths.length == this.curves.length) {
            return this.cacheLengths;
        }

        // Get length of subsurve
        // Push sums into cached array

        var lengths: number[] = []
        var sums = 0
        var i: number
        var il = this.curves.length

        for (i = 0; i < il; i++) {
            sums += this.curves[i].getLength()
            lengths.push(sums)
        }
        this.cacheLengths = lengths
        return lengths
    }
}
