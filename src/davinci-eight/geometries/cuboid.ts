//
// cuboid.ts
//
/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
/// <reference path="../geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../geometries/CuboidGeometry.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');

declare var Euclidean3: any;

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
let DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aVertexPosition';
let DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME    = 'aVertexColor';
let DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE   = [1.0, 0.0, 0.0];
let DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME   = 'aVertexNormal';

var cuboid = function(
  spec?: {
    position?:{
      name?:string
    },
    color?:{
      name?:string,
      value?: number[]
    },
    normal?:{
      name?:string
    }
  }): CuboidGeometry {

  function getOverride<T>(which: string, prop: string, defaultValue: T, type: string): T {
    if (spec && spec[which] && typeof spec[which][prop] === type) {
      return spec[which][prop];
    }
    else {
      return defaultValue;
    }
  }

  let VERTEX_ATTRIBUTE_POSITION = getOverride('position', 'name', DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME, 'string');
  let VERTEX_ATTRIBUTE_COLOR    = getOverride('color', 'name', DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME, 'string');
  let VERTEX_ATTRIBUTE_NORMAL   = getOverride('normal', 'name', DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME, 'string');

  var a: blade.Euclidean3 = new Euclidean3(0,1,0,0,0,0,0,0);
  var b: blade.Euclidean3 = new Euclidean3(0,0,1,0,0,0,0,0);
  var c: blade.Euclidean3 = new Euclidean3(0,0,0,1,0,0,0,0);
  var grayScale = false;

  var vertexAttributeColor = getOverride('color', 'value', DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE, 'object');

  var elements: number[] = [];

  var aVertexPositionArray: Float32Array;
  var aVertexColorArray: Float32Array;
  var aVertexNormalArray: Float32Array;

  var publicAPI: CuboidGeometry = {
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
    get color() {
      return vertexAttributeColor;
    },
    set color(value: number[]) {
      vertexAttributeColor = value;
    },
    get grayScale() {
      return grayScale;
    },
    set grayScale(value: boolean) {
      grayScale = value;
    },
    draw(context: WebGLRenderingContext) {
      context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
    },
    dynamic(): boolean {return false;},
    getAttributeMetaInfos(): AttributeMetaInfos {
      var attribues: AttributeMetaInfos = {};
      attribues['position'] = {
        name: VERTEX_ATTRIBUTE_POSITION,
        type: 'vec3',
        size: 3,
        normalized: false,
        stride: 0,
        offset: 0};
      if (!grayScale) {
      attribues['color'] = {
        name: VERTEX_ATTRIBUTE_COLOR,
        type: 'vec3',
        size: 3,
        normalized: false,
        stride: 0,
        offset: 0};
      }
      attribues['normal'] = {
        name: VERTEX_ATTRIBUTE_NORMAL,
        type: 'vec3',
        size: 3,
        normalized: false,
        stride: 0,
        offset: 0};
      return attribues;
    },
    hasElements(): boolean {
      return false;
    },
    getElements(): Uint16Array {
      // We don't support element arrays (yet).
      return;
    },
    getVertexAttributeData(name: string) {
      switch(name) {
        case VERTEX_ATTRIBUTE_POSITION: {
          return aVertexPositionArray;
        }
        case VERTEX_ATTRIBUTE_COLOR: {
          if (!grayScale) {
            return aVertexColorArray;
          }
          else {
            throw new Error('color requested when not available');
          }
        }
        case VERTEX_ATTRIBUTE_NORMAL: {
          return aVertexNormalArray;
        }
        default: {
          return;
        }
      }
    },
    update(time: number, attributes: {name: string}[]): void {
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

      // Insist that things won't work without aVertexPosition.
      // We just degrade gracefully if the other attribute arrays are not required.
      if (!requirePosition) {
        throw new Error("Cuboid geometry is expecting to provide " + VERTEX_ATTRIBUTE_POSITION);
      }
  
      let vertices: number[] = [];
      let colors: number[] = [];
      let normals: number[] = [];

      let vertexList: blade.Euclidean3[] = computeVertexList();

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
          colors.push(vertexAttributeColor[0]);
          colors.push(vertexAttributeColor[1]);
          colors.push(vertexAttributeColor[2]);

          colors.push(vertexAttributeColor[0]);
          colors.push(vertexAttributeColor[1]);
          colors.push(vertexAttributeColor[2]);

          colors.push(vertexAttributeColor[0]);
          colors.push(vertexAttributeColor[1]);
          colors.push(vertexAttributeColor[2]);
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
      if (requirePosition) {
        aVertexPositionArray = new Float32Array(vertices);
      }
      if (requireColor) {
        aVertexColorArray = new Float32Array(colors);
      }
      if (requireNormal) {
        aVertexNormalArray = new Float32Array(normals);
      }
    }
  };
  return publicAPI;
};

export = cuboid;
