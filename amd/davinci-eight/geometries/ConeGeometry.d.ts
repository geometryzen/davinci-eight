import Cartesian3 = require('../math/Cartesian3');
import SliceGeometry = require('../geometries/SliceGeometry');
/**
 * @class ConeGeometry
 * @extends SliceGeometry
 */
declare class ConeGeometry extends SliceGeometry {
    radiusTop: number;
    radius: number;
    height: number;
    openTop: boolean;
    openBottom: boolean;
    thetaStart: number;
    /**
     * @class ConeGeometry
     * @constructor
     * @param radiusTop [number = 0.5]
     * @param radius [number = 0.5]
     * @param height [number = 1]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     * @param thetaStart [number = 0]
     */
    constructor(radius: number, height: number, axis: Cartesian3, radiusTop?: number, openTop?: boolean, openBottom?: boolean, thetaStart?: number);
    regenerate(): void;
}
export = ConeGeometry;
