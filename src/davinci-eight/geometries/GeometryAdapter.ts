import AttribMetaInfos = require('../core/AttribMetaInfos');
import Face3 = require('../core/Face3');
import Line3 = require('../core/Line3');
import Point3 = require('../core/Point3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import DefaultAttribProvider = require('../core/DefaultAttribProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');

function defaultColorFunction(vertexIndex: number, face: Face3, vertexList: Vector3[]): Color {
  return new Color([1.0, 1.0, 1.0]);
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
//public color: Color;
//public colorFunction: (vertexIndex: number, face: Face3, vertexList: Vector3[]) => Color;
  private elementArray: Uint16Array;
  private aVertexPositionArray: Float32Array;
//private aVertexColorArray: Float32Array;
  private aVertexNormalArray: Float32Array;
  private $drawMode: DrawMode = DrawMode.TRIANGLES;
  private elementsUsage: DataUsage = DataUsage.STREAM_DRAW;
  public grayScale: boolean = false;
  private lines: Line3[] = [];
  private points: Point3[] = [];
  private positionVarName: string;
  private normalVarName: string;
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
    this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
    this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
    this.geometry = geometry;
//  this.color = new Color([1.0, 1.0, 1.0]);
    this.geometry.dynamic = false;
    this.$drawMode = options.drawMode;
    this.elementsUsage = options.elementsUsage;
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
  draw(context: WebGLRenderingContext): void {
    switch(this.drawMode) {
      case DrawMode.POINTS: {
        context.drawArrays(context.POINTS, 0, this.points.length * 1);
      }
      break;
      case DrawMode.LINES: {
        context.drawArrays(context.LINES, 0, this.lines.length * 2);
      }
      break;
      case DrawMode.TRIANGLES: {
        //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
        context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
      }
      break;
      default : {
      }
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
//      case DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME: {
//        return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexColorArray };
//      }
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
  getAttribMeta(): AttribMetaInfos {
    var attribues: AttribMetaInfos = {};

    attribues[Symbolic.ATTRIBUTE_POSITION] = {
      name: this.positionVarName,
      glslType: 'vec3',
      size: 3,
      normalized: false,
      stride: 0,
      offset: 0
    };

/*
    if (!this.grayScale) {
      attribues[Symbolic.ATTRIBUTE_COLOR] = {
        name: DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME,
        glslType: 'vec4',
        size: 4,
        normalized: false,
        stride: 0,
        offset: 0
      };
    }
*/
    if (this.drawMode === DrawMode.TRIANGLES) {
      attribues[Symbolic.ATTRIBUTE_NORMAL] = {
        name: this.normalVarName,
        glslType: 'vec3',
        size: 3,
        normalized: false,
        stride: 0,
        offset: 0
      };
    }

    return attribues;
  }
  update(attributes: ShaderVariableDecl[]): void
  {
    let vertices: number[] = [];
//  let colors: number[] = [];
    let normals: number[] = [];
    let elements: number[] = [];

    let vertexList = this.geometry.vertices;
    /*
    let color = this.color;
    let colorFunction = this.colorFunction;
    let colorMaker = function(vertexIndex: number, face: Face3, vertexList: Vector3[]): Color
    {
      if (color)
      {
        return color;
      }
      else if (colorFunction)
      {
        return colorFunction(vertexIndex, face, vertexList);
      }
      else
      {
        return defaultColorFunction(vertexIndex, face, vertexList);
      }
    }
    */
    switch(this.drawMode) {
      case DrawMode.POINTS: {
        this.points = [];
        this.computePoints();
        this.points.forEach(function(point: Point3) {
          elements.push(point.a);

          let vA: Vector3 = vertexList[point.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);
          /*
          var colorA: Color = color;
          colors.push(colorA.red);
          colors.push(colorA.green);
          colors.push(colorA.blue);
          colors.push(1.0);
          */
        });
      }
      break;
      case DrawMode.LINES: {
        this.lines = [];
        this.computeLines();
        this.lines.forEach(function(line: Line3) {
          elements.push(line.a);
          elements.push(line.b);

          let vA: Vector3 = vertexList[line.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);

          let vB: Vector3 = vertexList[line.b];
          vertices.push(vB.x);
          vertices.push(vB.y);
          vertices.push(vB.z);

          /*
          var colorA: Color = color;
          var colorB: Color = color;
          colors.push(colorA.red);
          colors.push(colorA.green);
          colors.push(colorA.blue);
          colors.push(1.0);

          colors.push(colorB.red);
          colors.push(colorB.green);
          colors.push(colorB.blue);
          colors.push(1.0);
          */
        });
      }
      break;
      case DrawMode.TRIANGLES: {
        this.geometry.faces.forEach(function(face: Face3) {
          elements.push(face.a);
          elements.push(face.b);
          elements.push(face.c);

          let vA: Vector3 = vertexList[face.a];
          vertices.push(vA.x);
          vertices.push(vA.y);
          vertices.push(vA.z);

          let vB: Vector3 = vertexList[face.b];
          vertices.push(vB.x);
          vertices.push(vB.y);
          vertices.push(vB.z);

          let vC: Vector3 = vertexList[face.c];
          vertices.push(vC.x);
          vertices.push(vC.y);
          vertices.push(vC.z);

          // TODO: 3 means per-vertex, 1 means same per face, 0 means compute face normals?
          if (face.normals.length === 3) {
              let nA = face.normals[0];
              let nB = face.normals[1];
              let nC = face.normals[2];
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

            let normal: Vector3 = face.normals[0];

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
          /*
          var colorA: Color = colorMaker(face.a, face, vertexList);
          var colorB: Color = colorMaker(face.b, face, vertexList);
          var colorC: Color = colorMaker(face.c, face, vertexList);

          colors.push(colorA.red);
          colors.push(colorA.green);
          colors.push(colorA.blue);
          colors.push(1.0);

          colors.push(colorB.red);
          colors.push(colorB.green);
          colors.push(colorB.blue);
          colors.push(1.0);

          colors.push(colorC.red);
          colors.push(colorC.green);
          colors.push(colorC.blue);
          colors.push(1.0);
          */
        });
      }
      break;
      default: {
      }
    }
    this.elementArray = new Uint16Array(elements);
    this.aVertexPositionArray = new Float32Array(vertices);
//  this.aVertexColorArray = new Float32Array(colors);
    this.aVertexNormalArray = new Float32Array(normals);
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
