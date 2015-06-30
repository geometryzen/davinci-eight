//
// boxGeometry.ts
//
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
import PrimitiveMode = require('davinci-eight/core/PrimitiveMode');

var vertexList: blade.Euclidean3[] =
[
  // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
  vectorE3(-0.5, -0.5, +0.5),
  vectorE3(+0.5, -0.5, +0.5),
  vectorE3(+0.5, +0.5, +0.5),
  vectorE3(-0.5, +0.5, +0.5),

  // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
  vectorE3(-0.5, -0.5, -0.5),
  vectorE3(+0.5, -0.5, -0.5),
  vectorE3(+0.5, +0.5, -0.5),
  vectorE3(-0.5, +0.5, -0.5)
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

var boxGeometry = function(spec?): Geometry {

  var elements: number[] = [];

  var aVertexPositionArray: Float32Array;
  var aVertexColorArray: Float32Array;
  var aVertexNormalArray: Float32Array;

  var publicAPI = {
    draw(context: WebGLRenderingContext) {
      context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
    },
    dynamic(): boolean {return false;},
    getAttributes() {
      return [
        {name: 'aVertexPosition',size: 3, normalized: false, stride: 0, offset: 0},
        {name: 'aVertexColor',size: 3, normalized: false, stride: 0, offset: 0},
        {name: 'aVertexNormal',size: 3, normalized: false, stride: 0, offset: 0}
      ];
    },
    getElements(): Uint16Array {
      // We don't support element arrays (yet).
      return;
    },
    getVertexAttribArrayData(name: string) {
      switch(name) {
        case 'aVertexPosition': {
          return aVertexPositionArray;
        }
        case 'aVertexColor': {
          return aVertexColorArray;
        }
        case 'aVertexNormal': {
          return aVertexNormalArray;
        }
        default: {
          return;
        }
      }
    },
    update(time: number, names: string[]): void {
      let requirePosition: boolean = names.indexOf('aVertexPosition') >= 0;
      let requireColor: boolean = names.indexOf('aVertexColor') >= 0;
      let requireNormal: boolean = names.indexOf('aVertexNormal') >= 0;

      // Insist that things won't work without aVertexPosition.
      // We just degrade gracefully if the other attribute arrays are not required.
      if (!requirePosition) {
        throw new Error("Box geometry is expecting to provide aVertexPosition");
      }
  
      let vertices: number[] = [];
      let colors: number[] = [];
      let normals: number[] = [];

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
          colors.push(0.0);
          colors.push(0.0);
          colors.push(1.0);

          colors.push(0.0);
          colors.push(0.0);
          colors.push(1.0);

          colors.push(0.0);
          colors.push(0.0);
          colors.push(1.0);
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

export = boxGeometry;
