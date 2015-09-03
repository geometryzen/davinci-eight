import Cartesian2 = require('../math/Cartesian2');
import Cartesian3 = require('../math/Cartesian3');
import Face3 = require('../core/Face3');
import Sphere = require('../math/Sphere');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import isDefined = require('../checks/isDefined');

function updateFaceNormal(face: Face3, vertices: Cartesian3[]) {
  face.normals = [];
  let vA: Cartesian3 = vertices[face.a];
  let vB: Cartesian3 = vertices[face.b];
  let vC: Cartesian3 = vertices[face.c];
  let cb = new Vector3().subVectors(vC, vB);
  let ab = new Vector3().subVectors(vA, vB);
  let normal = new Vector3().crossVectors(cb, ab).normalize();
  // TODO: I think we only need to push one normal here?
  face.normals.push(normal);
  face.normals.push(normal);
  face.normals.push(normal);
}

/**
 * @class Geometry
 */
 class Geometry {
  public vertices: Cartesian3[] = [];
  public faces: Face3[] = [];
  public faceVertexUvs: Cartesian2[][][] = [[]];
  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
  public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
  constructor() {
  }
  protected computeBoundingSphere(): void {
    this.boundingSphere.setFromPoints(this.vertices);
  }
  /**
   * Ensures that the normal property of each face is assigned
   * a value equal to the normalized cross product of two edge vectors
   * taken counter-clockwise. This pseudo vector is then taken to face outwards by convention.
   * @method computeFaceNormals
   */
  // TODO: What would happen if we computed unit tangent spinors?
  // Would such elements of the geometry be better behaved than pseudo vectors?
  protected computeFaceNormals(): void {
    // Avoid the this pointer in forEach callback function.
    let vertices = this.vertices;
    let updateFaceNormalCallback = function(face: Face3) {return updateFaceNormal(face, vertices);};
    this.faces.forEach(updateFaceNormalCallback);
  }
  protected computeVertexNormals(areaWeighted?: boolean): void {
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

      var vA: Cartesian3;
      var vB: Cartesian3;
      var vC: Cartesian3;
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
        vertexNormals[face.a].add(face.normals[0]);
        vertexNormals[face.b].add(face.normals[0]);
        vertexNormals[face.c].add(face.normals[0]);
      }

    }

    for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {
      vertexNormals[v].normalize();
    }

    for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {
      face = this.faces[ f ];
      face.normals[0] = vertexNormals[face.a].clone();
      face.normals[1] = vertexNormals[face.b].clone();
      face.normals[2] = vertexNormals[face.c].clone();
    }
  }
  /**
   * Updates the geometry by merging closely separated vertices.
   * @method mergeVertices
   * @param precisionPoints {number} number of decimal points, eg. 4 for epsilon of 0.0001
   */
  protected mergeVertices(precisionPoints: number = 4) {
    /**
     * Hashmap for looking up vertice by position coordinates (and making sure they are unique).
     * key is constructed from coordinates, value is index in vertices array.
     */
    var verticesMap: {[key:string]:number} = {};
    /**
     * The list of unique vertices.
     */
    var unique: Cartesian3[] = [];
    /**
     * Index is original index in vertices. Entry is index in unique array.
     */
    var changes: number[] = [];

    let precision = Math.pow(10, precisionPoints);
    var i: number;
    var il: number;
    var indices, j, jl;

    for (i = 0, il = this.vertices.length; i < il; i ++) {
      let v: Cartesian3 = this.vertices[ i ];
      let key: string = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

      if (verticesMap[key] === void 0) {
        verticesMap[key] = i;
        unique.push(this.vertices[i]);
        changes[i] = unique.length - 1;
      }
      else {
        changes[i] = changes[verticesMap[key]];
      }
    }


    // if faces are completely degenerate after merging vertices, we
    // have to remove them.
    var faceIndicesToRemove: number[] = [];

    // Update the faces to use the unique indices.
    for ( i = 0, il = this.faces.length; i < il; i ++ ) {

      let face: Face3 = this.faces[ i ];

      face.a = changes[ face.a ];
      face.b = changes[ face.b ];
      face.c = changes[ face.c ];

      indices = [ face.a, face.b, face.c ];

      var dupIndex = - 1;

      // if any duplicate vertices are found in a Face3
      // we have to remove the face as nothing can be saved
      for ( var n = 0; n < 3; n ++ ) {
        if ( indices[ n ] == indices[ ( n + 1 ) % 3 ] ) {

          dupIndex = n;
          faceIndicesToRemove.push( i );
          break;

        }
      }

    }

    for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {
      var idx = faceIndicesToRemove[ i ];

      this.faces.splice( idx, 1 );

      for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

        this.faceVertexUvs[ j ].splice( idx, 1 );

      }

    }

    // Use unique set of vertices

    var diff = this.vertices.length - unique.length;
    this.vertices = unique;
    return diff;
  }
}

export = Geometry;
