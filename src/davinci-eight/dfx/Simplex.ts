import expectArg = require('../checks/expectArg');
import Symbolic = require('../core/Symbolic');
import Vertex = require('../dfx/Vertex');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');

function expectArgVector3(name: string, vector: Vector3): Vector3 {
  return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
}

class Simplex {
  public vertices: Vertex[] = [];
  /**
   * @class Simplex
   * @constructor
   * @param points {Vector3[]}
   */
  constructor(points: Vector3[]) {
    this.vertices = points.map(function(point, index){
      return new Vertex(expectArgVector3('point', point));
    });
    let parent = this;
    this.vertices.forEach(function(vertex) {
      vertex.parent = parent;
    });
  }
  public static computeFaceNormals(simplex: Simplex): void {
    expectArg('simplex', simplex).toBeObject();
    expectArg('name', name).toBeString();
    let k = simplex.vertices.length;
    let vA: Vector3 = new Vector3(simplex.vertices[0].position.data);
    let vB: Vector3 = new Vector3(simplex.vertices[1].position.data);
    let vC: Vector3 = new Vector3(simplex.vertices[2].position.data);
    let cb = new Vector3().subVectors(vC, vB);
    let ab = new Vector3().subVectors(vA, vB);
    let normal = new Vector3().crossVectors(cb, ab).normalize();
    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
  }
  public static indices(simplex: Simplex): number[] {
    return simplex.vertices.map(function(vertex) { return vertex.index; });
  }
  private static subdivideOne(simplex: Simplex): Simplex[] {
    expectArg('simplex', simplex).toBeObject();
    let divs = new Array<Simplex>();
    let k = simplex.vertices.length;
    if (k === 3) {
      let a = simplex.vertices[0].position;
      let b = simplex.vertices[1].position;
      let c = simplex.vertices[2].position;

      let m1 = a.clone().lerp(b, 0.5);
      let m2 = b.clone().lerp(c, 0.5);
      let m3 = c.clone().lerp(a, 0.5);
      
      let face1 = new Simplex([c, m3, m2]);
      let face2 = new Simplex([a, m1, m3]);
      let face3 = new Simplex([b, m2, m1]);
      let face4 = new Simplex([m1, m2, m3]);
      
      divs.push(face1);
      divs.push(face2);
      divs.push(face3);
      divs.push(face4);
    }
    else if (k === 2) {

    }
    else if (k === 1) {
      divs.push(simplex);
    }
    else {

    }

    return divs;
  }
  public static subdivide(faces: Simplex[]): Simplex[] {
    return faces.map(Simplex.subdivideOne).reduce(function(a: Simplex[], b: Simplex[]) {return a.concat(b);},[]);
  }
}

export = Simplex;