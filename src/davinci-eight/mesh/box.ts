//
// box.ts
//
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
i
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

var box = function(spec?) {

  var elements: number[] = [];

  var positionArray: Float32Array;
  var colorArray: Float32Array;
  var normalArray: Float32Array;
  var drawMode: number = 2;

  var publicAPI = {
    draw(context: WebGLRenderingContext) {
      context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
    },
    get drawMode(): number {
      return drawMode;
    },
    get dynamic(): boolean {
      return false;
    },
    update(): void {
      let names: string[] = attributes.map(function(attribute){return attribute.name});
      let requirePosition: boolean = names.indexOf('aPosition') >= 0;
      let requireColor: boolean = names.indexOf('aColor') >= 0;
      let requireNormal: boolean = names.indexOf('aNormal') >= 0;

      if (!requirePosition) {
        throw new Error("box is expecting to provide aPosition");
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

export = box;
