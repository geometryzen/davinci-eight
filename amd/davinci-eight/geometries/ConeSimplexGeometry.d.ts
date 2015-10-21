import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry');
import VectorE3 = require('../math/VectorE3');
/**
 * @class ConeSimplexGeometry
 * @extends SliceSimplexGeometry
 */
declare class ConeSimplexGeometry extends SliceSimplexGeometry {
    radiusTop: number;
    radius: number;
    height: number;
    openTop: boolean;
    openBottom: boolean;
    thetaStart: number;
    /**
     * @class ConeSimplexGeometry
     * @constructor
     * @param radiusTop [number = 0.5]
     * @param radius [number = 0.5]
     * @param height [number = 1]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     * @param thetaStart [number = 0]
     */
    constructor(radius: number, height: number, axis: VectorE3, radiusTop?: number, openTop?: boolean, openBottom?: boolean, thetaStart?: number);
    regenerate(): void;
}
export = ConeSimplexGeometry;
