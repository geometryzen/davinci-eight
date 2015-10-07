import Geometry = require('../geometries/Geometry')
import mustBeInteger = require('../checks/mustBeInteger')
import Simplex = require('../geometries/Simplex')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class VortexGeometry
 */
class VortexGeometry extends Geometry {
  /**
   * @class VortexGeometry
   * @constructor
   * @param radius [number = 1]
   * @param radiusCone [number = 0.08]
   * @param radiusShaft [number = 0.01]
   * @param lengthCone [number = 0.2]
   * @param lengthShaft [number = 0.8]
   * @param arrowSegments [number = 8]
   * @param radialSegments [number = 12]
   */
  constructor(
    radius: number = 1,
    radiusCone: number = 0.08,
    radiusShaft: number = 0.01,
    lengthCone: number = 0.2,
    lengthShaft: number = 0.8,
    arrowSegments: number = 8,
    radialSegments: number = 12) {
    super();

    var n = 9;
    var circleSegments = arrowSegments * n;

    var twoPI = Math.PI * 2;
    var R = radius;
    var center = new Vector3([0, 0, 0]);

    var normals: Vector3[] = [];
    var points: Vector3[] = [];
    var uvs: Vector2[] = [];

    var alpha = lengthShaft / (lengthCone + lengthShaft);
    var factor = twoPI / arrowSegments;
    var theta = alpha / (n - 2);


    function computeAngle(index: number): number {
      var m = index % n;
      if (m === n - 1) {
        return computeAngle(index - 1);
      }
      else {
        var a = (index - m)/n;
        return factor * (a + m * theta);
      }
    }

    function computeRadius(index: number): number {
      var m = index % n;
      if (m === n - 1) {
        return radiusCone;
      }
      else {
        return radiusShaft;
      }
    }

    for ( var j = 0; j <= radialSegments; j++ ) {

      // v is the angle inside the vortex tube.
      var v = twoPI * j / radialSegments;
      var cosV = Math.cos(v);
      var sinV = Math.sin(v);

      for ( var i = 0; i <= circleSegments; i++ ) {

        // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
        var u = computeAngle(i)
        var cosU = Math.cos(u);
        var sinU = Math.sin(u);

        center.x = R * cosU;
        center.y = R * sinU;

        var vertex = new Vector3([0, 0, 0]);
        var r = computeRadius(i);
        vertex.x = (R + r * cosV ) * cosU;
        vertex.y = (R + r * cosV ) * sinU;
        vertex.z = r * sinV;

        points.push( vertex );

        uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
        normals.push( vertex.clone().sub( center ).normalize() );
      }
    }

    for ( var j = 1; j <= radialSegments; j++ ) {

      for ( var i = 1; i <= circleSegments; i++ ) {

        var a = ( circleSegments + 1 ) * j + i - 1;
        var b = ( circleSegments + 1 ) * ( j - 1 ) + i - 1;
        var c = ( circleSegments + 1 ) * ( j - 1 ) + i;
        var d = ( circleSegments + 1 ) * j + i;

        var face = new Simplex(Simplex.K_FOR_TRIANGLE)

        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[a]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[a].clone()

        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone()

        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone()

        this.data.push(face)

        var face = new Simplex(Simplex.K_FOR_TRIANGLE)

        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone()

        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[c]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[c].clone()

        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone()

        this.data.push(face)
      }
    }
  }
}

export = VortexGeometry;
