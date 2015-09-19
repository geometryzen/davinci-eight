import Simplex = require('../dfx/Simplex');
import Vector1 = require('../math/Vector1');
import Vector3 = require('../math/Vector3');
declare function buildPlane(u: string, v: string, udir: number, vdir: number, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, materialIndex: Vector1, points: Vector3[], faces: Simplex[]): void;
export = buildPlane;
