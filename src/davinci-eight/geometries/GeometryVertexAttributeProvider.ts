/// <reference path='../geometries/AttributeMetaInfos'/>
/// <reference path='../geometries/VertexAttributeProvider'/>
import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');

/**
 * This class acts as an adapter from a Geometry to a VertexAttributeProvider.
 */
class GeometryVertexAttributeProvider<G extends Geometry> implements VertexAttributeProvider {
  public geometry: G;
  private aVertexPositionArray: Float32Array;
  private aVertexColorArray: Float32Array;
  private aVertexNormalArray: Float32Array;
  constructor(geometry: G) {
    this.geometry = geometry;
  }
  draw(context: WebGLRenderingContext): void {
    context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
  }
  dynamics(): boolean {
    // TODO: EIGHT.VertexAttributeProvider.dynamic should also be a property.
      return false;//this.geometry.dynamic;
  }
  hasElements(): boolean {
    return false;
  }
  getElements(): Uint16Array {
    throw new Error("getElements");
    return null;
  }
  getVertexAttributeData(name: string): Float32Array {
      switch(name) {
        case 'aVertexPosition': {
          return this.aVertexPositionArray;
        }
        case 'aVertexColor': {
          return this.aVertexColorArray;
        }
        case 'aVertexNormal': {
          return this.aVertexNormalArray;
        }
        default: {
          return;
        }
      }
  }
  getAttributeMetaInfos(): AttributeMetaInfos {
    return {
      position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
      color:    { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
      normal:   { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
    };
  }
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void {

    let vertices: number[] = [];
    let colors: number[] = [];
    let normals: number[] = [];
    let elements: number[] = [];

    let vertexList = this.geometry.vertices;

    this.geometry.faces.forEach(function(face: Face3) {

        elements.push(face.a);
        elements.push(face.b);
        elements.push(face.c);

        vertices.push(vertexList[face.a].x);
        vertices.push(vertexList[face.a].y);
        vertices.push(vertexList[face.a].z);

        vertices.push(vertexList[face.b].x);
        vertices.push(vertexList[face.b].y);
        vertices.push(vertexList[face.b].z);

        vertices.push(vertexList[face.c].x);
        vertices.push(vertexList[face.c].y);
        vertices.push(vertexList[face.c].z);

        colors.push(0);
        colors.push(1);
        colors.push(0);

        colors.push(0);
        colors.push(1);
        colors.push(0);

        colors.push(0);
        colors.push(1);
        colors.push(0);

        // Make copies where needed to avoid mutating the geometry.
        let a: Vector3 = vertexList[face.a];
        let b: Vector3 = vertexList[face.b].clone();
        let c: Vector3 = vertexList[face.c].clone();

        let perp: Vector3 = b.sub(a).cross(c.sub(a));
        let normal: Vector3 = perp.divideScalar(perp.length());

        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);

        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);

        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
    });
    this.aVertexPositionArray = new Float32Array(vertices);
    this.aVertexColorArray = new Float32Array(colors);
    this.aVertexNormalArray = new Float32Array(normals);
  }
}

export = GeometryVertexAttributeProvider;
