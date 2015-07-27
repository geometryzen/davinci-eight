import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Spinor3 = require('../math/Spinor3');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

class VortexGeometry extends Geometry
{
  constructor(
    radius: number = 1,
    radiusCone: number = 0.08,
    radiusShaft: number = 0.01,
    lengthCone: number = 0.2,
    lengthShaft: number = 0.8,
    arrowSegments: number = 8,
    radialSegments: number = 12) {
    super();
    var scope = this;
    var n = 9;
    radius = radius || 1;
    radiusCone  = radiusCone || 0.08;
    radiusShaft = radiusShaft || 0.01;
    lengthCone  = lengthCone || 0.2;
    lengthShaft = lengthShaft || 0.8;
    arrowSegments = arrowSegments || 8;
    var circleSegments = arrowSegments * n;
    radialSegments = radialSegments || 12;

    var twoPI = Math.PI * 2;
    var R = radius;
    var center = new Vector3();
    var uvs: Vector2[] = [];
    var normals: Vector3[] = [];

    var alpha = lengthShaft / (lengthCone + lengthShaft);
    var factor = twoPI / arrowSegments;
    var theta = alpha / (n - 2);

    function computeAngle(circleSegments, i) {
      var m = i % n;
      if (m === n - 1) {
        return computeAngle(circleSegments, i - 1);
      }
      else {
        var a = (i - m)/n;
        return factor * (a + m * theta);
      }
    }

    function computeRadius(i) {
      var m = i % n;
      if (m === n - 1) {
        return radiusCone;
      }
      else {
        return radiusShaft;
      }
    }

    for ( var j = 0; j <= radialSegments; j ++ ) {

      // v is the angle inside the vortex tube.
      var v = twoPI * j / radialSegments;
      var cosV = Math.cos(v);
      var sinV = Math.sin(v);

      for ( var i = 0; i <= circleSegments; i ++ ) {

        // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
        var u = computeAngle(circleSegments, i)
        var cosU = Math.cos(u);
        var sinU = Math.sin(u);

        center.x = R * cosU;
        center.y = R * sinU;

        var vertex = new Vector3();
        var r = computeRadius(i);
        vertex.x = (R + r * cosV ) * cosU;
        vertex.y = (R + r * cosV ) * sinU;
        vertex.z = r * sinV;

        this['vertices'].push( vertex );

        uvs.push( new Vector2( i / circleSegments, j / radialSegments ) );
        normals.push( vertex.clone().sub( center ).normalize() );
      }
    }

    for ( var j = 1; j <= radialSegments; j ++ ) {

      for ( var i = 1; i <= circleSegments; i ++ ) {

        var a = ( circleSegments + 1 ) * j + i - 1;
        var b = ( circleSegments + 1 ) * ( j - 1 ) + i - 1;
        var c = ( circleSegments + 1 ) * ( j - 1 ) + i;
        var d = ( circleSegments + 1 ) * j + i;

        var face = new Face3(a, b, d, void 0, [normals[a], normals[b], normals[d]]);
        face.normal.add( normals[ a ] );
        face.normal.add( normals[ b ] );
        face.normal.add( normals[ d ] );
        face.normal.normalize();

        this.faces.push(face);

        this.faceVertexUvs[0].push([uvs[a].clone(), uvs[b].clone(), uvs[d].clone()]);

        face = new Face3(b, c, d, void 0, [normals[b], normals[c], normals[d]]);
        face.normal.add( normals[ b ] );
        face.normal.add( normals[ c ] );
        face.normal.add( normals[ d ] );
        face.normal.normalize();

        this.faces.push(face);

        this.faceVertexUvs[0].push([uvs[b].clone(), uvs[c].clone(), uvs[d].clone()]);
      }
    }
  }
}

export = VortexGeometry;
