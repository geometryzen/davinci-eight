import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import Face3 = require('../core/Face3');
import Line3 = require('../core/Line3');
import Point3 = require('../core/Point3');
import Geometry = require('../geometries/Geometry');
import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import DefaultAttribProvider = require('../core/DefaultAttribProvider');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
import VertexBuffer = require('../core/VertexBuffer');
import ElementBuffer = require('../core/ElementBuffer');

function computeAttribData(
  positionVarName: string,
  positionBuffer: VertexBuffer,
  normalVarName: string,
  normalBuffer: VertexBuffer,
  drawMode: DrawMode): AttribDataInfos {
  var attributes: AttribDataInfos = {};
  attributes[positionVarName] = {buffer: positionBuffer, numComponents: 3};
  if (drawMode === DrawMode.TRIANGLES) {
    attributes[normalVarName] = {buffer: normalBuffer, numComponents: 3};
  }
  return attributes;
}


/**
 * Adapter from a Geometry to a AttribProvider.
 * Enables the rapid construction of meshes starting from classes that extend Geometry.
 * Automatically uses elements (vertex indices).
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
class GeometryAdapter extends DefaultAttribProvider {
  public geometry: Geometry;
  private elementArray: Uint16Array;
  private aVertexPositionArray: Float32Array;
  private aVertexNormalArray: Float32Array;
  private $drawMode: DrawMode = DrawMode.TRIANGLES;
  private elementsUsage: DataUsage = DataUsage.STREAM_DRAW;
  public grayScale: boolean = false;
  private lines: Line3[] = [];
  private points: Point3[] = [];
  private positionVarName: string;
  private normalVarName: string;
  private indexBuffer: ElementBuffer;
  private positionBuffer: VertexBuffer;
  private normalBuffer: VertexBuffer;
  private attributeDataInfos: AttribDataInfos;
  private _refCount: number = 0;
  /**
   * @class GeometryAdapter
   * @constructor
   * @param geometry {Geometry} The geometry that must be adapted to a AttribProvider.
   */
  constructor(
    geometry: Geometry,
    options?: {
      drawMode?: DrawMode;
      elementsUsage?: DataUsage;
      positionVarName?: string;
      normalVarName?: string;
    }) {
    super();
    options = options || {};
    options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
    options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
    // TODO: Sharing of buffers.
    this.indexBuffer = new ElementBuffer();
    this.indexBuffer.addRef();
    this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
    this.positionBuffer = new VertexBuffer();
    this.positionBuffer.addRef();
    this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
    this.normalBuffer = new VertexBuffer();
    this.normalBuffer.addRef();
    this.geometry = geometry;
    this.geometry.dynamic = false;
    this.$drawMode = options.drawMode;
    this.elementsUsage = options.elementsUsage;
    this.attributeDataInfos = computeAttribData(this.positionVarName, this.positionBuffer, this.normalVarName, this.normalBuffer, this.drawMode);
  }
  addRef() {
    this._refCount++;
    // console.log("GeometryAdapter.addRef() => " + this._refCount);
  }
  release() {
    this._refCount--;
    // console.log("GeometryAdapter.release() => " + this._refCount);
    if (this._refCount === 0) {
      this.indexBuffer.release();
      this.indexBuffer = void 0;
      this.positionBuffer.release();
      this.positionBuffer = void 0;
      this.normalBuffer.release();
      this.normalBuffer = void 0;
    }
  }
  contextFree(): void {
    this.indexBuffer.contextFree();
    this.positionBuffer.contextFree();
    this.normalBuffer.contextFree();
    super.contextFree();
  }
  contextGain(context: WebGLRenderingContext) {
    super.contextGain(context);
    this.indexBuffer.contextGain(context);
    this.positionBuffer.contextGain(context);
    this.normalBuffer.contextGain(context);
    this.update();
  }
  contextLoss(): void {
    this.indexBuffer.contextLoss();
    this.positionBuffer.contextLoss();
    this.normalBuffer.contextLoss();
    super.contextLoss();
  }
  hasContext(): boolean {
    return !!this._context;
  }
  get drawMode(): DrawMode {
    return this.$drawMode;
  }
  set drawMode(value: DrawMode) {
    // Changing the drawMode after accessing attribute meta data causes
    // a shader program to be created that does not agree with
    // what the mesh is able to provide.
    throw new Error("The drawMode property is readonly");
  }
  draw(): void {
    if (this._context) {
      switch(this.drawMode) {
        case DrawMode.POINTS: {
          this._context.drawArrays(this._context.POINTS, 0, this.points.length * 1);
        }
        break;
        case DrawMode.LINES: {
          this._context.drawArrays(this._context.LINES, 0, this.lines.length * 2);
        }
        break;
        case DrawMode.TRIANGLES: {
          //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
          this._context.drawArrays(this._context.TRIANGLES, 0, this.geometry.faces.length * 3);
        }
        break;
        default : {
        }
      }
    }
    else {
      console.warn("GeometryAdapter.draw() missing WebGLRenderingContext");
    }
  }
  get dynamic(): boolean {
    return this.geometry.dynamic;
  }
  hasElementArray(): boolean {
    return true;
  }
  getElementArray() {
    return {usage: this.elementsUsage, data: this.elementArray};
  }
  getAttribArray(name: string) {
    // FIXME: Need to inject usage for each array type.
    switch(name) {
      case this.positionVarName: {
        return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexPositionArray };
      }
      case this.normalVarName: {
        if (this.$drawMode === DrawMode.TRIANGLES) {
          return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexNormalArray };
        }
        else {
          return;
        }
      }
      default: {
        return;
      }
    }
  }
  getAttribData(): AttribDataInfos {
    return this.attributeDataInfos;
  }
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = {};

    attributes[Symbolic.ATTRIBUTE_POSITION] = {
      name: this.positionVarName,
      glslType: 'vec3',
      size: 3,
      normalized: false,
      stride: 0,
      offset: 0
    };
    if (this.drawMode === DrawMode.TRIANGLES) {
      attributes[Symbolic.ATTRIBUTE_NORMAL] = {
        name: this.normalVarName,
        glslType: 'vec3',
        size: 3,
        normalized: false,
        stride: 0,
        offset: 0
      };
    }

    return attributes;
  }
  update(): void
  {
    let vertices: number[] = [];
    let normals: number[] = [];
    let elements: number[] = [];

    let vertexList: Cartesian3[] = this.geometry.vertices;
    switch(this.drawMode) {
      case DrawMode.POINTS: {
        this.points = [];
        this.computePoints();
        this.points.forEach(function(point: Point3) {
          elements.push(point.a);

          let vA: Cartesian3 = vertexList[point.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);
        });
      }
      break;
      case DrawMode.LINES: {
        this.lines = [];
        this.computeLines();
        this.lines.forEach(function(line: Line3) {
          elements.push(line.a);
          elements.push(line.b);

          let vA: Cartesian3 = vertexList[line.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);

          let vB: Cartesian3 = vertexList[line.b];
          vertices.push(vB.x);
          vertices.push(vB.y);
          vertices.push(vB.z);
        });
      }
      break;
      case DrawMode.TRIANGLES: {
        this.geometry.faces.forEach(function(face: Face3) {
          elements.push(face.a);
          elements.push(face.b);
          elements.push(face.c);

          let vA: Cartesian3 = vertexList[face.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);

          let vB: Cartesian3 = vertexList[face.b];
          vertices.push(vB.x);
          vertices.push(vB.y);
          vertices.push(vB.z);

          let vC: Cartesian3 = vertexList[face.c];
          vertices.push(vC.x);
          vertices.push(vC.y);
          vertices.push(vC.z);

          // TODO: 3 means per-vertex, 1 means same per face, 0 means compute face normals?
          if (face.normals.length === 3) {
              let nA: Cartesian3 = face.normals[0];
              let nB: Cartesian3 = face.normals[1];
              let nC: Cartesian3 = face.normals[2];
              normals.push(nA.x);
              normals.push(nA.y);
              normals.push(nA.z);

              normals.push(nB.x);
              normals.push(nB.y);
              normals.push(nB.z);

              normals.push(nC.x);
              normals.push(nC.y);
              normals.push(nC.z);
          }
          else if (face.normals.length === 1) {

            let normal: Cartesian3 = face.normals[0];

            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);

            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);

            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);
          }
        });
      }
      break;
      default: {
      }
    }
    this.elementArray = new Uint16Array(elements);
    this.indexBuffer.bind();
    this.indexBuffer.data(this.elementArray);

    this.aVertexPositionArray = new Float32Array(vertices);
    this.positionBuffer.bind();
    this.positionBuffer.data(this.aVertexPositionArray);

    this.aVertexNormalArray = new Float32Array(normals);
    this.normalBuffer.bind();
    this.normalBuffer.data(this.aVertexNormalArray);
  }
  private computeLines() {
    var lines = this.lines;
    this.geometry.faces.forEach(function(face: Face3) {
      lines.push(new Line3(face.a, face.b));
      lines.push(new Line3(face.b, face.c));
      lines.push(new Line3(face.c, face.a));
    });
  }
  private computePoints() {
    var points = this.points;
    this.geometry.faces.forEach(function(face: Face3) {
      points.push(new Point3(face.a));
      points.push(new Point3(face.b));
      points.push(new Point3(face.c));
    });
  }
}

export = GeometryAdapter;
