//
// ellipsoid.ts
//
/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import AttribMetaInfos = require('../core/AttribMetaInfos');
import EllipsoidMesh = require('../mesh/EllipsoidMesh');
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');

declare var Euclidean3: any;

//
// Computing the mesh of an ellipsoid (essentially a deformed sphere) is rather
// intricate owing to the fact that the spherical coordinate parameters, theta and phi,
// have different characteristics.
//

// The smallest number of segments corresponds to two tetrahedrons.
// This is actually the worst case which occurs when theta includes the poles
// and phi closes.
let THETA_SEGMENTS_MINIMUM = 2;
let PHI_SEGMENTS_MINIMUM = 3;

// For more realism, use more segments. The complexity of computation goes as the square.
let REALISM = 7;
let THETA_SEGMENTS_DEFAULT = THETA_SEGMENTS_MINIMUM * REALISM;
let PHI_SEGMENTS_DEFAULT   = PHI_SEGMENTS_MINIMUM * REALISM;

function cacheTrig(segments: number, start: number, length: number, cosCache: number[], sinCache: number[]) {
  for (var index = 0; index <= segments; index++) {
    var angle = start + index * length / segments;
    cosCache.push(Math.cos(angle));
    sinCache.push(Math.sin(angle));
  }
}

function computeVertex(
  a: blade.Euclidean3,
  b: blade.Euclidean3,
  c: blade.Euclidean3,
  cosTheta: number,
  sinTheta: number,
  cosPhi: number,
  sinPhi: number): blade.Euclidean3 {
  // Optimize for the north and south pole by simplifying the calculation.
  // This has no other effect than for performance.
  let optimize = false;
  let northPole = optimize && (cosTheta === +1);
  let southPole = optimize && (cosTheta === -1);
  if (northPole) {
    return b;
  }
  else if (southPole) {
    return b.scalarMultiply(-1);
  }
  else {
    let A = a.scalarMultiply(cosPhi).scalarMultiply(sinTheta);
    let B = b.scalarMultiply(cosTheta);
    let C = c.scalarMultiply(sinPhi).scalarMultiply(sinTheta);
    return A.add(B).add(C);
  }
}

var ellipsoid = function(spec?): EllipsoidMesh {

  var a: blade.Euclidean3 = new Euclidean3(0,1,0,0,0,0,0,0);
  var b: blade.Euclidean3 = new Euclidean3(0,0,1,0,0,0,0,0);
  var c: blade.Euclidean3 = new Euclidean3(0,0,0,1,0,0,0,0);
  var thetaSegments = THETA_SEGMENTS_DEFAULT;
  var thetaStart = 0;
  var thetaLength = Math.PI;
  var phiSegments = PHI_SEGMENTS_DEFAULT;
  var phiStart = 0;
  var phiLength = 2 * Math.PI;

  var elements: number[] = [];
  var triangles: number[][] = [];

  var positionArray: Float32Array;
  var colorArray: Float32Array;
  var normalArray: Float32Array;
  var drawMode: number = 2;

  var publicAPI: EllipsoidMesh = {
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
    get thetaSegments(): number {
      return thetaSegments;
    },
    set thetaSegments(value: number) {
      thetaSegments = Math.max(THETA_SEGMENTS_MINIMUM, Math.floor(value) || THETA_SEGMENTS_DEFAULT);
    },
    get thetaStart(): number {
      return thetaStart;
    },
    set thetaStart(value: number) {
      thetaStart = value;
    },
    get thetaLength(): number {
      return thetaLength;
    },
    set thetaLength(value: number) {
      thetaLength = Math.max(0, Math.min(value, Math.PI));
    },
    get phiSegments(): number {
      return phiSegments;
    },
    set phiSegments(value: number) {
      phiSegments = Math.max(PHI_SEGMENTS_MINIMUM, Math.floor(value) || PHI_SEGMENTS_DEFAULT);
    },
    get phiStart(): number {
      return phiStart;
    },
    set phiStart(value: number) {
      phiStart = value;
    },
    get phiLength(): number {
      return phiLength;
    },
    set phiLength(value: number) {
      phiLength = Math.max(0, Math.min(value, 2 * Math.PI));
    },
    draw(context: WebGLRenderingContext) {
      context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
    },
    get drawMode(): number {
      return drawMode;
    },
    get dynamic(): boolean {
      return false;
    },
    getAttribMeta(): AttribMetaInfos {
      // TODO: Use the defaults.
      return {
        position: { name: 'aPosition', glslType: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
        color:    { name: 'aColor',    glslType: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
        normal:   { name: 'aNormal',   glslType: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
      };
    },
    update(): void {
      // This function depends on how the vertexList is computed.
      function vertexIndex(thetaIndex: number, phiIndex: number): number {
        return thetaIndex * (phiSegments + 1) + phiIndex;
      }
      function computeVertexList(cosThetaCache: number[], sinThetaCache: number[], cosPhiCache: number[], sinPhiCache: number[]) {
        let vertexList: blade.Euclidean3[] = [];
        var cosTheta: number;
        var sinTheta: number;
        var cosPhi: number;
        var sinPhi: number;
        for (var thetaIndex = 0; thetaIndex <= thetaSegments; thetaIndex++) {
          cosTheta = cosThetaCache[thetaIndex];
          sinTheta = sinThetaCache[thetaIndex];
          // We compute more phi points because phi may not return back to the start.
          for (var phiIndex = 0; phiIndex <= phiSegments; phiIndex++) {
            cosPhi = cosPhiCache[phiIndex];
            sinPhi = sinPhiCache[phiIndex];
            vertexList.push(computeVertex(a, b, c, cosTheta, sinTheta, cosPhi, sinPhi));
          }
        }
        return vertexList;
      }
      function computeTriangles(): number[][] {
        let faces: number[][] = [];
        for (var thetaIndex = 0; thetaIndex < thetaSegments; thetaIndex++) {
          for (var phiIndex = 0; phiIndex < phiSegments; phiIndex++) {
            var index1 = vertexIndex(thetaIndex, phiIndex);
            var index2 = vertexIndex(thetaIndex, phiIndex + 1);
            var index3 = vertexIndex(thetaIndex + 1, phiIndex + 1);
            var index4 = vertexIndex(thetaIndex + 1, phiIndex);
            faces.push([index1, index2, index3]);
            faces.push([index1, index3, index4]);
          }
        }
        return faces;
      }
      let names: string[] = attributes.map(function(attribute){return attribute.name});
      let requirePosition: boolean = names.indexOf('aPosition') >= 0;
      let requireColor: boolean = names.indexOf('aColor') >= 0;
      let requireNormal: boolean = names.indexOf('aNormal') >= 0;

      if (!requirePosition) {
        throw new Error("ellipsoid is expecting to provide aPosition");
      }
  
      let vertices: number[] = [];
      let colors: number[] = [];
      let normals: number[] = [];

      // Cache values of cosine and sine of theta and phi.
      let cosThetaCache: number[] = [];
      let sinThetaCache: number[] = [];
      cacheTrig(thetaSegments, thetaStart, thetaLength, cosThetaCache, sinThetaCache);
      let cosPhiCache: number[] = [];
      let sinPhiCache: number[] = [];
      cacheTrig(phiSegments, phiStart, phiLength, cosPhiCache, sinPhiCache);

      let vertexList: blade.Euclidean3[] = computeVertexList(cosThetaCache, sinThetaCache, cosPhiCache, sinPhiCache);
      triangles = computeTriangles();

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

export = ellipsoid;
