import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Euclidean3 = require('../math/Euclidean3');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import isDefined = require('../checks/isDefined');

class EllipticalCylinderGeometry extends Geometry {
  constructor(
    radiusTop: number = 1,
    radiusBottom: number = 1,
    height: number = 1,
    radialSegments: number = 16,
    heightSegments: number = 1,
    openEnded: boolean = false,
    thetaStart: number = 0,
    thetaLength: number = 2 * Math.PI) {

    super();

    let h = Euclidean3.scalar(height).mul(Euclidean3.e2);  // This will become a parameter.
    let two = Euclidean3.TWO;

    let heightHalf = h.div(two);

    var x: number;
    var y: number;
    let vertices: number[][] = [];
    let uvs: Vector2[][] = [];

    for ( y = 0; y <= heightSegments; y ++ ) {

      let verticesRow: number[] = [];
      let uvsRow: Vector2[] = [];

      var v = y / heightSegments;
      var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

      for ( x = 0; x <= radialSegments; x ++ ) {

        let u = x / radialSegments;

        let vertex = new Vector3();
        vertex.x = radius * Math.sin( u * thetaLength + thetaStart );
//TODO        vertex.y = - v * height + heightHalf;
        vertex.z = radius * Math.cos( u * thetaLength + thetaStart );

        this.vertices.push( vertex );

        verticesRow.push( this.vertices.length - 1 );
        uvsRow.push(new Vector2([u, 1 - v]));

      }

      vertices.push( verticesRow );
      uvs.push( uvsRow );

    }

    let tanTheta = ( radiusBottom - radiusTop ) / height;
    var na: Vector3;
    var nb: Vector3;

    for ( x = 0; x < radialSegments; x ++ ) {

      if ( radiusTop !== 0 ) {
        na = this.vertices[ vertices[ 0 ][ x ] ].clone();
        nb = this.vertices[ vertices[ 0 ][ x + 1 ] ].clone();
      }
      else {
        na = this.vertices[ vertices[ 1 ][ x ] ].clone();
        nb = this.vertices[ vertices[ 1 ][ x + 1 ] ].clone();
      }

      na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
      nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();

      for ( y = 0; y < heightSegments; y ++ ) {

        var v1 = vertices[ y ][ x ];
        var v2 = vertices[ y + 1 ][ x ];
        var v3 = vertices[ y + 1 ][ x + 1 ];
        var v4 = vertices[ y ][ x + 1 ];

        var n1 = na.clone();
        var n2 = na.clone();
        var n3 = nb.clone();
        var n4 = nb.clone();

        var uv1 = uvs[ y ][ x ].clone();
        var uv2 = uvs[ y + 1 ][ x ].clone();
        var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
        var uv4 = uvs[ y ][ x + 1 ].clone();

        this.faces.push( new Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

        this.faces.push( new Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );
      }
    }

    // top cap

    if (!openEnded && radiusTop > 0 ) {

//TODO      this.vertices.push(Vector3..e2.clone().multiplyScalar(heightHalf));

      for ( x = 0; x < radialSegments; x ++ ) {

        var v1 = vertices[ 0 ][ x ];
        var v2 = vertices[ 0 ][ x + 1 ];
        var v3 = this.vertices.length - 1;

        var n1 = Vector3.e2;
        var n2 = Vector3.e2;
        var n3 = Vector3.e2;

        var uv1 = uvs[ 0 ][ x ].clone();
        var uv2 = uvs[ 0 ][ x + 1 ].clone();
        var uv3 = new Vector2([uv2.x, 0]);

        this.faces.push( new Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

      }

    }

    // bottom cap

    if (!openEnded && radiusBottom > 0 ) {

      this.vertices.push(Vector3.e2.clone().multiplyScalar(-heightHalf));

      for ( x = 0; x < radialSegments; x ++ ) {

        var v1 = vertices[ heightSegments ][ x + 1 ];
        var v2 = vertices[ heightSegments ][ x ];
        var v3 = this.vertices.length - 1;

        var n1 = Vector3.e2.clone().multiplyScalar(-1);
        var n2 = Vector3.e2.clone().multiplyScalar(-1);
        var n3 = Vector3.e2.clone().multiplyScalar(-1);

        var uv1 = uvs[ heightSegments ][ x + 1 ].clone();
        var uv2 = uvs[ heightSegments ][ x ].clone();
        var uv3 = new Vector2([uv2.x, 1]);

        this.faces.push( new Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

      }

    }

    this.computeFaceNormals();
  }
}

export = EllipticalCylinderGeometry;
