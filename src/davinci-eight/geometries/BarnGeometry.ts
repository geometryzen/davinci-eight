import Geometry = require('../geometries/Geometry');
import Face3 = require('../core/Face3');
import Vector3 = require('../math/Vector3');

/**
 * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
 * @class BarnGeometry
 */
class BarnGeometry extends Geometry {
  constructor() {
    super();
    let vertexList = this.vertices;
    function vertex(x: number, y: number, z: number) {
      vertexList.push(new Vector3([x, y, z]));
    }
    vertex(-0.5, 0.0, -1.0);
    this.vertices.push(new Vector3([ 0.5, 0.0, -1.0]));
    this.vertices.push(new Vector3([ 0.5, 1.0, -1.0]));
    this.vertices.push(new Vector3([ 0.0, 1.5, -1.0]));
    this.vertices.push(new Vector3([-0.5, 1.0, -1.0]));

    this.vertices.push(new Vector3([-0.5, 0.0,  1.0]));
    this.vertices.push(new Vector3([ 0.5, 0.0,  1.0]));
    this.vertices.push(new Vector3([ 0.5, 1.0,  1.0]));
    this.vertices.push(new Vector3([ 0.0, 1.5,  1.0]));
    this.vertices.push(new Vector3([-0.5, 1.0,  1.0]));

    this.faces.push(new Face3(1, 0, 2));
    this.faces.push(new Face3(2, 0, 4));
    this.faces.push(new Face3(2, 4, 3));

    this.faces.push(new Face3(5, 6, 7));
    this.faces.push(new Face3(5, 7, 9));
    this.faces.push(new Face3(9, 7, 8));

    this.faces.push(new Face3(6, 1, 2));
    this.faces.push(new Face3(6, 2, 7));

    this.faces.push(new Face3(9, 0, 5));
    this.faces.push(new Face3(9, 4, 0));

    this.faces.push(new Face3(8, 3, 4));
    this.faces.push(new Face3(8, 4, 9));

    this.faces.push(new Face3(7, 2, 3));
    this.faces.push(new Face3(7, 3, 8));

    this.faces.push(new Face3(5, 0, 1));
    this.faces.push(new Face3(5, 1, 6));

    this.computeFaceNormals();
  }
}

export = BarnGeometry;
