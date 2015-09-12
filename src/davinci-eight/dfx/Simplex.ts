import expectArg = require('../checks/expectArg');
import Symbolic = require('../core/Symbolic');
import Vertex = require('../dfx/Vertex');
import VectorN = require('../math/VectorN');

function expectArgVectorN(name: string, vector: VectorN<number>): VectorN<number> {
  return expectArg(name, vector).toSatisfy(vector instanceof VectorN, name + ' must be a VectorN').value;
}

function lerp(a: number[], b: number[], alpha: number, data: number[] = []): number[] {
  expectArg('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
  let dims = a.length;
  var i: number;
  let beta = 1 - alpha;
  for (i = 0; i < dims; i++) {
    data.push(beta * a[i] + alpha * b[i]);
  }
  return data;
}

class Simplex {
  public vertices: Vertex[] = [];
  /**
   * @class Simplex
   * @constructor
   * @param points {VectorN<number>[]}
   */
  constructor(points: VectorN<number>[]) {
    this.vertices = points.map(function(point, index){
      return new Vertex(expectArgVectorN('point', point));
    });
    let parent = this;
    this.vertices.forEach(function(vertex) {
      vertex.parent = parent;
    });
  }
  public static indices(simplex: Simplex): number[] {
    return simplex.vertices.map(function(vertex) { return vertex.index; });
  }
  private static subdivideOne(simplex: Simplex): Simplex[] {
    expectArg('simplex', simplex).toBeObject();
    let divs = new Array<Simplex>();
    let vertices = simplex.vertices;
    let k = vertices.length;
    if (k === 3) {
      // TODO: Need to lerp all attributes? YES! See below.
      // FIXME: This should not be special.
      let a = vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION];
      let b = vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION];
      let c = vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION];

      let m1 = new VectorN<number>(lerp(a.data, b.data, 0.5));
      let m2 = new VectorN<number>(lerp(b.data, c.data, 0.5));
      let m3 = new VectorN<number>(lerp(c.data, a.data, 0.5));

      let face1 = new Simplex([c, m3, m2]);
      let face2 = new Simplex([a, m1, m3]);
      let face3 = new Simplex([b, m2, m1]);
      let face4 = new Simplex([m1, m2, m3]);
      // TODO: subdivision is losing attributes.
      divs.push(face1);
      divs.push(face2);
      divs.push(face3);
      divs.push(face4);
    }
    else if (k === 2) {
      let a = vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION];
      let b = vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION];

      let m = new VectorN<number>(lerp(a.data, b.data, 0.5));

      let line1 = new Simplex([a, m]);
      let line2 = new Simplex([m, b]);
      
      divs.push(line1);
      divs.push(line2);
    }
    else if (k === 1) {
      divs.push(simplex);
    }
    else if (k === 0) {
      divs.push(simplex);
    }
    else {
      throw new Error(k + "-simplex is not supported");
    }

    return divs;
  }
  public static subdivide(faces: Simplex[]): Simplex[] {
    return faces.map(Simplex.subdivideOne).reduce(function(a: Simplex[], b: Simplex[]) {return a.concat(b);},[]);
  }
  // TODO: This function destined to be part of Simplex constructor.
  public static setAttributeValues(attributes: {[name: string]: VectorN<number>[]}, simplex: Simplex) {
    let names: string[] = Object.keys(attributes);
    let attribsLength = names.length;
    let attribIndex;
    for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
      let name = names[attribIndex];
      let values: VectorN<number>[] = attributes[name];
      let valuesLength = values.length;
      let valueIndex;
      for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
        simplex.vertices[valueIndex].attributes[name] = values[valueIndex];
      }
    }
  }
}

export = Simplex;