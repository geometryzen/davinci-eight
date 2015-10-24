import R3 = require('../math/R3');
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * Some common of Curve methods
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following classes subclasses Curve:
 *
 * LineCurve
 * QuadraticBezierCurve
 * CubicBezierCurve
 * SplineCurve
 * ArcCurve
 * EllipseCurve
 * ClosedSplineCurve
 *
 */
class Curve {
  private cacheArcLengths: number[];
  private needsUpdate: boolean;
  private __arcLengthDivisions: number;
  constructor() {
  }
  /**
   * Virtual base class method to overwrite and implement in subclasses
   * t belongs to [0, 1]
   */
  getPoint(t: number): R3 {
    throw new Error( "Curve.getPoint() not implemented!" );
  }
  /**
   * Get point at relative position in curve according to arc length
   */
 getPointAt(u: number): R3 {
    var t = this.getUtoTmapping( u );
    return this.getPoint( t );
  }
  getPoints(divisions?: number): R3[] {
    if ( ! divisions ) {
      divisions = 5;
    } 
    var d: number;
    var pts: R3[] = [];
    for ( d = 0; d <= divisions; d ++ )
    {
      pts.push( this.getPoint( d / divisions ) );
    }
    return pts;
  }
  getSpacedPoints(divisions?: number): R3[] {
    if ( ! divisions ) {
      divisions = 5;
    }
    var d: number;
    var pts: R3[] = [];
    for ( d = 0; d <= divisions; d ++ )
    {
      pts.push( this.getPointAt( d / divisions ) );
    }
    return pts;
  }
  getLength(): number {
    var lengths = this.getLengths();
    return lengths[ lengths.length - 1 ];
  }
  getLengths(divisions?: number): number[] {

    if ( ! divisions ) divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;

    if ( this.cacheArcLengths
      && ( this.cacheArcLengths.length == divisions + 1 )
      && ! this.needsUpdate) {

      return this.cacheArcLengths;

    }

    this.needsUpdate = false;

    var cache: number[] = [];
    var current: R3;
    var last: R3 = this.getPoint( 0 );
    var p:  number;
    var sum: number = 0;

    cache.push( 0 );

    for ( p = 1; p <= divisions; p ++ ) {

      current = this.getPoint ( p / divisions );
      sum += current.distanceTo(last);
      cache.push( sum );
      last = current;

    }

    this.cacheArcLengths = cache;

    return cache; // { sums: cache, sum:sum }; Sum is in the last element.

  }
  updateArcLengths() {
    this.needsUpdate = true;
    this.getLengths();
  }
  /**
   * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
   */
  getUtoTmapping(u: number, distance?: number): number {

    var arcLengths = this.getLengths();

    var i = 0, il = arcLengths.length;

    var targetArcLength: number; // The targeted u distance value to get

    if ( distance ) {

      targetArcLength = distance;

    } else {

      targetArcLength = u * arcLengths[ il - 1 ];

    }

    //var time = Date.now();

    // binary search for the index with largest value smaller than target u distance

    var low = 0;
    var high = il - 1
    var comparison: number;

    while ( low <= high ) {

      i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

      comparison = arcLengths[ i ] - targetArcLength;

      if ( comparison < 0 ) {

        low = i + 1;

      } else if ( comparison > 0 ) {

        high = i - 1;

      } else {

        high = i;
        break;

        // DONE

      }

    }

    i = high;

    if ( arcLengths[ i ] == targetArcLength ) {

      var t = i / ( il - 1 );
      return t;

    }

    // we could get finer grain at lengths, or use simple interpolatation between two points

    var lengthBefore = arcLengths[ i ];
    var lengthAfter = arcLengths[ i + 1 ];

    var segmentLength = lengthAfter - lengthBefore;

      // determine where we are between the 'before' and 'after' points

    var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

      // add that fractional amount to t

    var t = ( i + segmentFraction ) / ( il - 1 );

    return t;

  }

  /**
   * Returns a unit vector tangent at t
   * In case any sub curve does not implement its tangent derivation,
   * 2 points a small delta apart will be used to find its gradient
   * which seems to give a reasonable approximation
   */
  getTangent(t: number): R3 {

    var delta = 0.0001;
    var t1 = t - delta;
    var t2 = t + delta;

    // Capping in case of danger

    if ( t1 < 0 ) t1 = 0;
    if ( t2 > 1 ) t2 = 1;

    var pt1 = this.getPoint( t1 );
    var pt2 = this.getPoint( t2 );

    // TypeScript Generics don't help here because we can't do T extends Vector<T>. 
    var vec = pt2['clone']().sub(pt1);
    return vec.normalize();

  }

  getTangentAt(u: number): R3 {
    var t: number = this.getUtoTmapping(u);
    return this.getTangent( t );
  }
}

export = Curve;
