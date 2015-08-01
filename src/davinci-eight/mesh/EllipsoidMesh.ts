/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import AttribProvider = require('../core/AttribProvider');

/**
 * @class EllipsoidMesh
 */
interface EllipsoidMesh extends AttribProvider {
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

export = EllipsoidMesh;
