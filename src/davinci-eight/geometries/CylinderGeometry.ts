import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

class CylinderGeometry extends Geometry {
  constructor(
    radiusTop: number = 1,
    radiusBottom: number = 1,
    height: number = 1,
    radialSegments: number = 16,
    heightSegments: number = 1,
    openEnded: boolean = false,
    thetaStart: number = 0,
    thetaLength: number = 2 * Math.PI) {

    radialSegments = Math.max(radialSegments, 3);
    heightSegments = Math.max(heightSegments, 1);

    super();

    let heightHalf = height / 2;

    var x: number;
    var y: number;
    let vertices: number[][] = [];
    let uvs: Vector2[][] = [];

    for ( y = 0; y <= heightSegments; y ++ ) {
      let verticesRow: number[] = [];
      let uvsRow: Vector2[] = [];
      let v = y / heightSegments;
      let radius = v * ( radiusBottom - radiusTop ) + radiusTop;
      for ( x = 0; x <= radialSegments; x ++ ) {
        let u = x / radialSegments;
        let vertex = new Vector3();
        vertex.x = radius * Math.sin( u * thetaLength + thetaStart );
        vertex.y = - v * height + heightHalf;
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
        na = Vector3.copy(this.vertices[vertices[0][x]]);
        nb = Vector3.copy(this.vertices[vertices[0][x + 1]]);
      }
      else {
        na = Vector3.copy(this.vertices[vertices[1][x]]);
        nb = Vector3.copy(this.vertices[vertices[1][x + 1]]);
      }
      na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
      nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();
      for ( y = 0; y < heightSegments; y ++ ) {
        let v1: number = vertices[ y ][ x ];
        let v2: number = vertices[ y + 1 ][ x ];
        let v3: number = vertices[ y + 1 ][ x + 1 ];
        let v4: number = vertices[ y ][ x + 1 ];
        let n1 = na.clone();
        let n2 = na.clone();
        let n3 = nb.clone();
        let n4 = nb.clone();
        let uv1 = uvs[ y ][ x ].clone();
        let uv2 = uvs[ y + 1 ][ x ].clone();
        let uv3 = uvs[ y + 1 ][ x + 1 ].clone();
        let uv4 = uvs[ y ][ x + 1 ].clone();
        this.faces.push( new Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );
        this.faces.push( new Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );
      }
    }

    // top cap
    if (!openEnded && radiusTop > 0 ) {
      this.vertices.push(Vector3.e2.clone().multiplyScalar(heightHalf));
      for ( x = 0; x < radialSegments; x ++ ) {
        let v1: number = vertices[0][x];
        let v2: number = vertices[0][x + 1];
        let v3: number = this.vertices.length - 1;
        let n1: Vector3 = Vector3.e2.clone();
        let n2: Vector3 = Vector3.e2.clone();
        let n3: Vector3 = Vector3.e2.clone();
        let uv1: Vector2 = uvs[ 0 ][x].clone();
        let uv2: Vector2 = uvs[ 0 ][x + 1].clone();
        let uv3: Vector2 = new Vector2([uv2.x, 0]);
        this.faces.push( new Face3(v1, v2, v3, [n1, n2, n3]));
        this.faceVertexUvs[0].push([uv1, uv2, uv3]);
      }
    }

    // bottom cap
    if (!openEnded && radiusBottom > 0) {
      this.vertices.push(Vector3.e2.clone().multiplyScalar(-heightHalf));
      for ( x = 0; x < radialSegments; x ++ ) {
        let v1: number  = vertices[heightSegments][x + 1];
        let v2: number = vertices[heightSegments][x];
        let v3: number = this.vertices.length - 1;
        let n1: Vector3 = Vector3.e2.clone().multiplyScalar(-1);
        let n2: Vector3 = Vector3.e2.clone().multiplyScalar(-1);
        let n3: Vector3 = Vector3.e2.clone().multiplyScalar(-1);
        let uv1: Vector2 = uvs[ heightSegments ][x + 1].clone();
        let uv2: Vector2 = uvs[ heightSegments ][x].clone();
        let uv3: Vector2 = new Vector2([uv2.x, 1]);
        this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
        this.faceVertexUvs[0].push([uv1, uv2, uv3]);
      }
    }
//    this.computeFaceNormals();
//    this.computeVertexNormals();
  }
}

export = CylinderGeometry;
