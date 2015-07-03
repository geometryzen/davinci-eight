/// <reference path='./Geometry.d.ts'/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
interface EllipsoidGeometry extends Geometry {
  a: blade.Euclidean3;
  b: blade.Euclidean3;
  c: blade.Euclidean3;
  thetaSegments: number;
  thetaStart: number;
  thetaLength: number;
  phiSegments: number;
  phiStart: number;
  phiLength: number;
}