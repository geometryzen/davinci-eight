//
// prism.ts
//
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');

// The numbering of the front face, seen from the front is
//   5
//  3 4
// 0 1 2 
// The numbering of the back face, seen from the front is
//   B
//  9 A
// 6 7 8 
// There are 12 vertices in total.
var vertexList: blade.Euclidean3[] =
    [
        // front face
        vectorE3(-1.0, 0.0, +0.5),
        vectorE3(0.0, 0.0, +0.5),
        vectorE3(1.0, 0.0, +0.5),
        vectorE3(-0.5, 1.0, +0.5),
        vectorE3(0.5, 1.0, +0.5),
        vectorE3(0.0, 2.0, +0.5),

        // rear face
        vectorE3(-1.0, 0.0, -0.5),
        vectorE3(0.0, 0.0, -0.5),
        vectorE3(1.0, 0.0, -0.5),
        vectorE3(-0.5, 1.0, -0.5),
        vectorE3(0.5, 1.0, -0.5),
        vectorE3(0.0, 2.0, -0.5)
    ];

// I'm not sure why the left and right side have 4 faces, but the botton only 2.
// Symmetry would suggest making them the same.
// There are 18 faces in total.
var triangles =
    [
        //front face
        [0, 1, 3],
        [1, 4, 3],
        [1, 2, 4],
        [3, 4, 5],

        //rear face
        [6, 9, 7],
        [7, 9, 10],
        [7, 10, 8],
        [9, 11, 10],

        //left side
        [0, 3, 6],
        [3, 9, 6],
        [3, 5, 9],
        [5, 11, 9],

        //right side
        [2, 8, 4],
        [4, 8, 10],
        [4, 10, 5],
        [5, 10, 11],
        //bottom faces
        [0, 6, 8],
        [0, 8, 2]
    ];

/**
 * Constructs and returns a prism mesh.
 */
var prism = function(spec?) {

  var elements: number[] = [];
  var vertices: number[] = [];
  var normals: number[] = [];
  var colors: number[] = [];
  var drawMode: number = 2;

  triangles.forEach(function(triangle: number[], index: number) {

    elements.push(triangle[0]);
    elements.push(triangle[1]);
    elements.push(triangle[2]);

    // Normals will be the same for each vertex of a triangle.
    var v0: blade.Euclidean3 = vertexList[triangle[0]];
    var v1: blade.Euclidean3 = vertexList[triangle[1]];
    var v2: blade.Euclidean3 = vertexList[triangle[2]];

    var perp: blade.Euclidean3 = v1.sub(v0).cross(v2.sub(v0));
    var normal: blade.Euclidean3 = perp.div(perp.norm());

    for (var j = 0; j < 3; j++) {
        vertices.push(vertexList[triangle[j]].x);
        vertices.push(vertexList[triangle[j]].y);
        vertices.push(vertexList[triangle[j]].z);

        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);

        colors.push(1.0);
        colors.push(0.0);
        colors.push(0.0);
    }
  });

  var publicAPI = {
    draw(context: WebGLRenderingContext) {
      context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
    },
    get drawMode(): number {
      return drawMode;
    },
    get dynamic(): boolean {return false;},
    update(): void {
    }
  };
  return publicAPI;
};

export = prism;
