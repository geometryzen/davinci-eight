import expectArg = require('../checks/expectArg');
import isInteger = require('../checks/isInteger');
import isNumber = require('../checks/isNumber');
import Vertex = require('../dfx/Vertex');
import VertexAttributeMap = require('../dfx/VertexAttributeMap');
import VectorN = require('../math/VectorN');

function checkIntegerArg(name: string, n: number, min: number, max: number): number {
  if (isInteger(n) && n >= min && n <= max) {
    return n;
  }
  // TODO: I don't suppose we can go backwards with a negative count? Hmmm...
  // expectArg(name, n).toBeInClosedInterval(min, max);
  expectArg(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
}
function checkCountArg(count: number) {
  // TODO: The count range should depend upon the k value of the simplex.
  return checkIntegerArg('count', count, 0, 7);
}

function concatReduce(a: Simplex[], b: Simplex[]): Simplex[] {
  return a.concat(b);
}

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

function lerpVertexAttributeMap(a: VertexAttributeMap, b: VertexAttributeMap, alpha: number): VertexAttributeMap {

  let attribMap: VertexAttributeMap = {};

  let keys = Object.keys(a);
  let keysLength = keys.length;
  for (var k = 0; k < keysLength;k++) {
    let key = keys[k];
    attribMap[key] = lerpVectorN(a[key], b[key], alpha);
  }
  return attribMap;
}
// TODO: Looks like a static of VectorN or a common function.
function lerpVectorN(a: VectorN<number>, b: VectorN<number>, alpha: number): VectorN<number> {
  return new VectorN<number>(lerp(a.data, b.data, alpha));
}

/**
 * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
 * A k-simplex is the convex hull of its k + 1 vertices.
 * @class Simplex
 */
class Simplex {
  /**
   * The vertices of the simplex.
   * @property
   * @type {Vertex[]}
   */
  public vertices: Vertex[] = [];
  /**
   * @class Simplex
   * @constructor
   * @param k {number} The initial number of vertices in the simplex is k + 1.
   */
  constructor(k: number) {
    if (!isInteger(k)) {
      expectArg('k', k).toBeNumber();
    }
    let numVertices: number = k + 1;
    for (var i = 0; i < numVertices; i++) {
      this.vertices.push(new Vertex());
    }
    let parent = this;
    this.vertices.forEach(function(vertex) {
      vertex.parent = parent;
    });
  }
  /**
   * The dimensionality of the simplex.
   * @property k
   * @type {number}
   * @readonly
   */
  get k(): number {
    return this.vertices.length - 1;
  }
  // These symbolic constants represent the correct k values for various low-dimesional simplices. 
  // The number of vertices in a k-simplex is k + 1.

  /**
   * An empty set can be consired to be a -1 simplex (algebraic topology).
   * @property K_FOR_EMPTY
   * @type {number}
   * @static
   */
  public static K_FOR_EMPTY = -1;

  /**
   * A single point may be considered a 0-simplex.
   * @property K_FOR_POINT
   * @type {number}
   * @static
   */
  public static K_FOR_POINT = 0;

  /**
   * A line segment may be considered a 1-simplex.
   * @property K_FOR_LINE_SEGMENT
   * @type {number}
   * @static
   */
  public static K_FOR_LINE_SEGMENT = 1;
  /**
   * A 2-simplex is a triangle.
   * @property K_FOR_TRIANGLE
   * @type {number}
   * @static
   */
  public static K_FOR_TRIANGLE = 2;
  /**
   * A 3-simplex is a tetrahedron.
   * @property K_FOR_TETRAHEDRON
   * @type {number}
   * @static
   */
  public static K_FOR_TETRAHEDRON = 3;
  /**
   * A 4-simplex is a 5-cell.
   * @property K_FOR_FIVE_CELL
   * @type {number}
   * @static
   */
  public static K_FOR_FIVE_CELL = 4;

  /**
   * @deprecated
   */
  // FIXME: We don't need the index property on the vertex (needs some work).
  public static indices(simplex: Simplex): number[] {
    return simplex.vertices.map(function(vertex) { return vertex.index; });
  }
  /**
   * Computes the boundary of the simplex.
   * @method boundaryMap
   * @param simplex {Simplex}
   * @return {Simplex[]}
   * @private
   */
  private static boundaryMap(simplex: Simplex): Simplex[] {
    let vertices = simplex.vertices;
    let k = simplex.k;
    if (k === Simplex.K_FOR_TRIANGLE) {
      var line01 = new Simplex(k - 1);
      line01.vertices[0].parent = line01;
      line01.vertices[0].attributes = simplex.vertices[0].attributes;
      line01.vertices[1].parent = line01;
      line01.vertices[1].attributes = simplex.vertices[1].attributes;

      var line12 = new Simplex(k - 1);
      line12.vertices[0].parent = line12;
      line12.vertices[0].attributes = simplex.vertices[1].attributes;
      line12.vertices[1].parent = line12;
      line12.vertices[1].attributes = simplex.vertices[2].attributes;

      var line20 = new Simplex(k - 1);
      line20.vertices[0].parent = line20;
      line20.vertices[0].attributes = simplex.vertices[2].attributes;
      line20.vertices[1].parent = line20;
      line20.vertices[1].attributes = simplex.vertices[0].attributes;
      return [line01, line12, line20];
    }
    else if (k === Simplex.K_FOR_LINE_SEGMENT) {
      var point0 = new Simplex(k - 1);
      point0.vertices[0].parent = point0;
      point0.vertices[0].attributes = simplex.vertices[0].attributes;

      var point1 = new Simplex(k - 1);
      point1.vertices[0].parent = point1;
      point1.vertices[0].attributes = simplex.vertices[1].attributes;
      return [point0, point1];
    }
    else if (k === Simplex.K_FOR_POINT) {
      // For consistency, we get one empty simplex rather than an empty list.
      return [new Simplex(k - 1)];
    }
    else if (k === Simplex.K_FOR_EMPTY) {
      return [];
    }
    else {
      // TODO: Handle the TETRAHEDRON and general cases.
      throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
    }
  }
  private static subdivideMap(simplex: Simplex): Simplex[] {
    expectArg('simplex', simplex).toBeObject();
    let divs: Simplex[] = [];
    let vertices = simplex.vertices;
    let k = simplex.k;
    if (k === Simplex.K_FOR_TRIANGLE) {
      let a = vertices[0].attributes;
      let b = vertices[1].attributes;
      let c = vertices[2].attributes;

      let m1 = lerpVertexAttributeMap(a, b, 0.5)
      let m2 = lerpVertexAttributeMap(b, c, 0.5)
      let m3 = lerpVertexAttributeMap(c, a, 0.5)

      let face1 = new Simplex(k);
      face1.vertices[0].attributes = c;
      face1.vertices[1].attributes = m3;
      face1.vertices[2].attributes = m2;
      let face2 = new Simplex(k);
      face2.vertices[0].attributes = a;
      face2.vertices[1].attributes = m1;
      face2.vertices[2].attributes = m3;
      let face3 = new Simplex(k);
      face3.vertices[0].attributes = b;
      face3.vertices[1].attributes = m2;
      face3.vertices[2].attributes = m1;
      let face4 = new Simplex(k);
      face4.vertices[0].attributes = m1;
      face4.vertices[1].attributes = m2;
      face4.vertices[2].attributes = m3;

      divs.push(face1);
      divs.push(face2);
      divs.push(face3);
      divs.push(face4);
    }
    else if (k === Simplex.K_FOR_LINE_SEGMENT) {
      let a = vertices[0].attributes;
      let b = vertices[1].attributes;

      let m = lerpVertexAttributeMap(a, b, 0.5)

      let line1 = new Simplex(k);
      line1.vertices[0].attributes = a;
      line1.vertices[1].attributes = m;
      let line2 = new Simplex(k);
      line2.vertices[0].attributes = m;
      line2.vertices[1].attributes = b;

      divs.push(line1);
      divs.push(line2);
    }
    else if (k === Simplex.K_FOR_POINT) {
      divs.push(simplex);
    }
    else if (k === Simplex.K_FOR_EMPTY) {
      // Ignore, don't push is the generalization.
    }
    else {
      throw new Error(k + "-simplex is not supported");
    }

    return divs;
  }
  /**
   * Computes the result of the boundary operation performed `count` times.
   * @method boundary
   * @param simplices {Simplex[]}
   * @param count {number}
   * @return {Simplex[]}
   */
  public static boundary(simplices: Simplex[], count: number = 1): Simplex[] {
    checkCountArg(count);
    for (var i = 0; i < count; i++) {
      simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
    }
    return simplices;
  }
  /**
   * Computes the result of the subdivide operation performed `count` times.
   * @method subdivide
   * @param simplices {Simplex[]}
   * @param count {number}
   * @return {Simplex[]}
   */
  public static subdivide(simplices: Simplex[], count: number = 1): Simplex[] {
    checkCountArg(count);
    for (var i = 0; i < count; i++) {
      simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
    }
    return simplices;
  }
  // TODO: This function destined to be part of Simplex constructor.
  // FIXME still used from triangle.ts!
  public static setAttributeValues(attributes: {[name: string]: VectorN<number>[]}, simplex: Simplex) {
    let names: string[] = Object.keys(attributes);
    let attribsLength = names.length;
    let attribIndex: number;
    for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
      let name = names[attribIndex];
      let values: VectorN<number>[] = attributes[name];
      let valuesLength = values.length;
      let valueIndex: number;
      for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
        simplex.vertices[valueIndex].attributes[name] = values[valueIndex];
      }
    }
  }
}

export = Simplex;