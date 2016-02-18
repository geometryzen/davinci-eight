import G3 from '../math/G3';
/*
var area = function ( contour ) {

    var n = contour.length;
    var a = 0.0;

    for ( var p = n - 1, q = 0; q < n; p = q ++ ) {

      a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

    }

    return a * 0.5;

  };
*/
export default function isClockWise(points: G3[]): boolean {
    // This needs to be relative to a bivector.
    // return area(pts) < 0
    throw new Error("isClockWise")
}
