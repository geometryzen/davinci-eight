import Geometry = require('../geometries/Geometry');
/**
 * @class ConeGeometry
 */
declare class ConeGeometry extends Geometry {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    heightSegments: number;
    radialSegments: number;
    openTop: boolean;
    openBottom: boolean;
    thetaStart: number;
    thetaLength: number;
    /**
     * @class ConeGeometry
     * @constructor
     * @param radiusTop [number = 0.5]
     * @param radiusBottom [number = 0.5]
     * @param height [number = 1]
     * @param radialSegments [number = 16]
     * @param heightSegments [number = 1]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     * @param thetaStart [number = 0]
     * @param thetaLength [number = 2 * Math.PI]
     */
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openTop?: boolean, openBottom?: boolean, thetaStart?: number, thetaLength?: number);
    regenerate(): void;
}
export = ConeGeometry;
