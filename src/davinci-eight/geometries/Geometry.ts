import Face3 = require('../core/Face3');
import Sphere = require('../math/Sphere');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

class Geometry {
  public vertices: Vector3[] = [];
  public faces: Face3[] = [];
  public faceVertexUvs: Vector2[][][] = [[]];
  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
  public boundingSphere: Sphere = null;
  constructor() {

  }
  computeBoundingSphere(): void {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }
    this.boundingSphere.setFromPoints(this.vertices);
  }
  computeFaceNormals(): void {

    let cb = new Vector3();
    let ab = new Vector3();

    for (var f = 0, fl = this.faces.length; f < fl; f ++) {

      let face = this.faces[ f ];

      let vA = this.vertices[face.a];
      let vB = this.vertices[face.b];
      let vC = this.vertices[face.c];

      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab);

      cb.normalize();

      face.normal.copy(cb);
    }
  }
  computeVertexNormals(areaWeighted?: boolean): void {
    var v: number;
    let vl: number = this.vertices.length;
    var f: number;
    var fl: number;
    var face: Face3;

    // For each vertex, we will compute a vertexNormal.
    // Store the results in an Array<Vector3>
    var vertexNormals: Array<Vector3> = new Array(this.vertices.length);
    for (v = 0, vl = this.vertices.length; v < vl; v++) {
      vertexNormals[v] = new Vector3();
    }

    if (areaWeighted) {

      // vertex normals weighted by triangle areas
      // http://www.iquilezles.org/www/articles/normals/normals.htm

      var vA: Vector3;
      var vB: Vector3;
      var vC: Vector3;
      var cb = new Vector3();
      var ab = new Vector3();

      for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

        face = this.faces[ f ];

        vA = this.vertices[ face.a ];
        vB = this.vertices[ face.b ];
        vC = this.vertices[ face.c ];

        cb.subVectors( vC, vB );
        ab.subVectors( vA, vB );
        cb.cross( ab );

        vertexNormals[face.a].add( cb );
        vertexNormals[face.b].add( cb );
        vertexNormals[face.c].add( cb );

      }

    }
    else {

      for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

        face = this.faces[ f ];

        vertexNormals[face.a].add(face.normal);
        vertexNormals[face.b].add(face.normal);
        vertexNormals[face.c].add(face.normal);

      }

    }

    for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

      vertexNormals[v].normalize();

    }

    for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

      face = this.faces[ f ];

      face.vertexNormals[0] = vertexNormals[face.a].clone();
      face.vertexNormals[1] = vertexNormals[face.b].clone();
      face.vertexNormals[2] = vertexNormals[face.c].clone();

    }
  }
}

export = Geometry;
