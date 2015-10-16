import Cartesian3 = require('../math/Cartesian3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
declare class CylinderGeometry extends Geometry {
    radius: number;
    height: number;
    axis: Vector3;
    start: Vector3;
    angle: number;
    thetaSegments: number;
    heightSegments: number;
    openTop: boolean;
    openBottom: boolean;
    /**
     * @class CylinderGeometry
     * @constructor
     * @param radius [number = 1]
     * @param height [number = 1]
     * @param axis [Cartesian3 = Vector3.e2]
     * @param start [Cartesian3 = Vector3.e1]
     * @param angle [number = 2 * Math.PI]
     * @param thetaSegments [number = 16]
     * @param heightSegments [number = 1]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     */
    constructor(radius?: number, height?: number, axis?: Cartesian3, start?: Cartesian3, angle?: number, thetaSegments?: number, heightSegments?: number, openTop?: boolean, openBottom?: boolean);
    regenerate(): void;
}
export = CylinderGeometry;
