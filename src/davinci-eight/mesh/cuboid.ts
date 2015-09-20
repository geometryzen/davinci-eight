//
// cuboid.ts
//
/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import CuboidMesh = require('../mesh/CuboidMesh');
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import DrawMode = require('../core/DrawMode');

declare var Euclidean3: any;

var points: number[][] = [
  [0],
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7]
];

var lines: number[][] = [
  [0, 1],
  [1, 5],
  [5, 4],
  [4, 0],
  [3, 2],
  [2, 6],
  [6, 7],
  [7, 3],
  [1, 2],
  [5, 6],
  [4, 7],
  [0, 3]
];

var triangles: number[][] =
[
  // front
  [0, 1, 2],
  [0, 2, 3],
  // rear
  [4, 7, 5],
  [5, 7, 6],
  // left
  [0, 7, 4],
  [0, 3, 7],
  // right
  [1, 5, 2],
  [2, 5, 6],
  // top
  [2, 7, 3],
  [2, 6, 7],
  // bottom
  [0, 5, 1],
  [0, 4, 5]
];

// TODO: We'd like to be able to use anything here and have some adapter fix the names.
let DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aPosition';
let DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME    = 'aColor';
let DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE   = new Color(1.0, 1.0, 1.0, 1.0);
let DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME   = 'aNormal';

var cuboid = function(
  options?: {
    position?:{
      name?:string
    },
    color?:{
      name?:string,
      value?: Color
    },
    normal?:{
      name?:string
    },
    drawMode?: number
  }): CuboidMesh {

  function getOverride<T>(which: string, prop: string, defaultValue: T, type: string): T {
    if (options && options[which] && typeof options[which][prop] === type) {
      return options[which][prop];
    }
    else {
      return defaultValue;
    }
  }

  options = options || {};
  options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;

  let VERTEX_ATTRIBUTE_POSITION = getOverride('position', 'name', DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME, 'string');
  let VERTEX_ATTRIBUTE_COLOR    = getOverride('color', 'name', DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME, 'string');
  let VERTEX_ATTRIBUTE_NORMAL   = getOverride('normal', 'name', DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME, 'string');

  var a: blade.Euclidean3 = new Euclidean3(0,1,0,0,0,0,0,0);
  var b: blade.Euclidean3 = new Euclidean3(0,0,1,0,0,0,0,0);
  var c: blade.Euclidean3 = new Euclidean3(0,0,0,1,0,0,0,0);
  var grayScale = false;

  var vertexAttributeColor: Color = getOverride('color', 'value', DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE, 'object');

  var elements: number[] = [];

  var positionArray: Float32Array;
  var colorArray: Float32Array;
  var normalArray: Float32Array;
  let drawMode: number = options.drawMode;

  var publicAPI: CuboidMesh = {
    get a(): blade.Euclidean3 {
      return a;
    },
    set a(value: blade.Euclidean3) {
      a = value;
    },
    get b(): blade.Euclidean3 {
      return b;
    },
    set b(value: blade.Euclidean3) {
      b = value;
    },
    get c(): blade.Euclidean3 {
      return c;
    },
    set c(value: blade.Euclidean3) {
      c = value;
    },
    get color(): Color {
      return vertexAttributeColor;
    },
    set color(value: Color) {
      vertexAttributeColor = value;
    },
    get grayScale() {
      return grayScale;
    },
    set grayScale(value: boolean) {
      grayScale = value;
    },
    draw(gl: WebGLRenderingContext) {
      switch(drawMode) {
        case 0: {
          gl.drawArrays(gl.POINTS, 0, points.length * 1);
        }
        break;
        case 1: {
          gl.drawArrays(gl.LINES, 0, lines.length * 2);
        }
        break;
        case 2: {
          gl.drawArrays(gl.TRIANGLES, 0, triangles.length * 3);
        }
        break;
        default : {
          throw new Error("Unexpected drawMode in cuboid.draw(): " + drawMode);
        }
      }
    },
    get drawMode() {
      return drawMode;
    },
    set drawMode(value: number) {
      throw new Error("The drawMode property is readonly.");
    },
    get dynamic(): boolean {
      return false;
    },
    update(): void {
      function computeVertexList() {
        var vertexList: blade.Euclidean3[] =
        [
          // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
          c.sub(a).sub(b).scalarMultiply(0.5),
          c.add(a).sub(b).scalarMultiply(0.5),
          c.add(a).add(b).scalarMultiply(0.5),
          c.sub(a).add(b).scalarMultiply(0.5),

          // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
          c.scalarMultiply(-1).sub(a).sub(b).scalarMultiply(0.5),
          c.scalarMultiply(-1).add(a).sub(b).scalarMultiply(0.5),
          c.scalarMultiply(-1).add(a).add(b).scalarMultiply(0.5),
          c.scalarMultiply(-1).sub(a).add(b).scalarMultiply(0.5)
        ];
        return vertexList;
      }
      let names: string[] = attributes.map(function(attribute){return attribute.name});
      let requirePosition: boolean = names.indexOf(VERTEX_ATTRIBUTE_POSITION) >= 0;
      let requireColor: boolean = names.indexOf(VERTEX_ATTRIBUTE_COLOR) >= 0;
      let requireNormal: boolean = names.indexOf(VERTEX_ATTRIBUTE_NORMAL) >= 0;

      if (!requirePosition) {
        throw new Error("cuboid is expecting to provide " + VERTEX_ATTRIBUTE_POSITION);
      }
  
      let vertices: number[] = [];
      let colors: number[] = [];
      let normals: number[] = [];

      let vertexList: blade.Euclidean3[] = computeVertexList();

      switch(drawMode) {
        case 0: {
          points.forEach(function(point: number[], index: number) {

            elements.push(point[0]);
            elements.push(point[1]);

            if (requirePosition) {
              for (var j = 0; j < 1; j++) {
                vertices.push(vertexList[point[j]].x);
                vertices.push(vertexList[point[j]].y);
                vertices.push(vertexList[point[j]].z);
              }
            }

            if (requireColor) {
              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);
            }
          });
        }
        break;
        case 1: {
          lines.forEach(function(line: number[], index: number) {

            elements.push(line[0]);
            elements.push(line[1]);

            if (requirePosition) {
              for (var j = 0; j < 2; j++) {
                vertices.push(vertexList[line[j]].x);
                vertices.push(vertexList[line[j]].y);
                vertices.push(vertexList[line[j]].z);
              }
            }

            if (requireColor) {
              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);

              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);
            }
          });
        }
        break;
        case 2: {
          triangles.forEach(function(triangle: number[], index: number) {

            elements.push(triangle[0]);
            elements.push(triangle[1]);
            elements.push(triangle[2]);

            if (requirePosition) {
              for (var j = 0; j < 3; j++) {
                vertices.push(vertexList[triangle[j]].x);
                vertices.push(vertexList[triangle[j]].y);
                vertices.push(vertexList[triangle[j]].z);
              }
            }

            if (requireColor) {
              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);

              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);

              colors.push(vertexAttributeColor.red);
              colors.push(vertexAttributeColor.green);
              colors.push(vertexAttributeColor.blue);
//            colors.push(vertexAttributeColor.alpha);
            }

            if (requireNormal) {
              let v0: blade.Euclidean3 = vertexList[triangle[0]];
              let v1: blade.Euclidean3 = vertexList[triangle[1]];
              let v2: blade.Euclidean3 = vertexList[triangle[2]];

              let perp: blade.Euclidean3 = v1.sub(v0).cross(v2.sub(v0));
              let normal: blade.Euclidean3 = perp.div(perp.norm());

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
          throw new Error("");
        }
      }

      if (requirePosition) {
        positionArray = new Float32Array(vertices);
      }
      if (requireColor) {
        colorArray = new Float32Array(colors);
      }
      if (requireNormal) {
        normalArray = new Float32Array(normals);
      }
    }
  };
  return publicAPI;
};

export = cuboid;
